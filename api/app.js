// LIBS
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
//const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const http = require('http')
const https = require('https')
const fs = require('fs')
const compression = require('compression')
// -----------------------------
// FILES
const config = require('../config')
const port = process.env.PORT || config.PORT_API
const domain = config.DOMAIN_API
// -----------------------------
// START DATABASE
mongoose.connect(config.DB_URL, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true}).then (() => {
    console.log(`База данных подключена`)
}).catch((e) => {
   console.error(e)
})
// -----------------------------
// MODELS
require('./models/points')
require('./models/logs')
require('./models/errors')
// -----------------------------
// MODELS VARs
const Point = mongoose.model('points')
const Log = mongoose.model('logs')
const Error = mongoose.model('errors')
// -----------------------------
// APP
const app = express()
const server = http.createServer(app)
// -----------------------------\

// APP SETTINGS
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(compression())
app.disable('x-powered-by')
// -----------------------------
// res.send({status: NUM, status_text: '', data: {}})

// http://www.restapitutorial.ru/httpstatuscodes.html
// 200: OK
// 201: Created
// 204: No Content
// 304: Not Modified
// 400: Bad Request
// 401: Unauthorized
// 403: Forbidden
// 404: Not Found
// 500: Internal Server Error

// res.send({status: 200, status_text: 'OK'})
// ✔️  ✖️
// SITE STATUS ✖️
app.get('/points', function (req, res) {
//    let currentLng = +req.query.lng
//    let currentLat = +req.query.lat
    
    let query = {}

//    if (currentLat != undefined && currentLng != undefined) {
//        query = {$and: [{"coords.lat": {$gte: currentLat-0.015, $lte: currentLat+0.015}}, {"coords.lng": {$gte: currentLng-0.03, $lte: currentLng+0.03}}]}
//    }
    
    GetData(Point, query).then(data => {
        if (data.length != 0) {
            res.send(data)
        } else {
            res.send({status: 404, status_text: 'Array Data Null'})
        }
    })
})                      // ✔️
app.get('/points/:id', function (req, res) {
    let id = +req.params.id
    GetOne(Point, {id}).then(data => {
        if (data != null) {
            res.send(data)
        } else {
            res.send({status: 404, status_text: 'Data Null'})
        }
    })
})                  // ✔️
app.delete('/points/:id', function (req, res) {
    let id = req.params.id
    GetOne(Point, {id}).then(data => {
        if (data != null) {
            Delete(Point, {id}, 'points')
            res.send({status: 200, status_text: 'OK', data})
        } else {
            res.send({status: 404, status_text: 'Data Null'})
        }
    })
})               // ✔️
app.put('/points/:id', function (req, res) {
    let id = +req.params.id
    
    let title = req.body.title
    let description = req.body.description
    
    let files = req.body.files
    
    let icon = req.body.icon
    let iconColor = req.body.iconColor
    
    let lat = req.body.coords.lat
    let lng = req.body.coords.lng
    
    GetOne(Point, {id}).then(point => {
        
        if (point != null) {
            Point.updateOne({id}, {
                $set: {
                    "title": title || point.title,
                    "description": description || point.description,
                    "files": files || point.files,
                    "icon": icon || point.icon,
                    "iconColor": iconColor || point.iconColor,
                    "coords.lat": lat || point.coords.lat,
                    "coords.lng": lng || point.coords.lng
                }
            }).then(() => {
                newLog(`Точка ${id} изменена пользователем с id: ${id_user}`)
                res.send({status: 200, status_text: 'OK'})
            }).catch(err => {
                newError(err)
                res.send({status: 400, status_text: 'Bad Request'})
            })
        }
    })
})                  // ✔️
app.post('/points', function (req, res) {
    
    let id_user = req.body.id_user
    let id_agency = req.body.id_agency
    
    let title = req.body.title
    let description = req.body.description
    
    let files = req.body.files
    
    let icon = req.body.icon
    let iconColor = req.body.iconColor
    
    let lat = req.body.coords.lat
    let lng = req.body.coords.lng
    
    GetOne(Point, {}, {id: -1}).then(last => {
        let id = last != null ? last.id + 1 : 1
        
        let newPoint = new Point({
            id,
            title,
            description,
            files,
            icon,
            iconColor,
            coords: {
                lat, lng
            },
            id_user,
            id_agency
        })
        newPoint.save().then(() => {
            newLog(`Точка ${id} создана пользователем с id: ${id_user}`)
            res.send({status: 200, status_text: 'OK'})
        }).catch(err => {
            newError(err)
            res.send({status: 400, status_text: 'Bad Request'})
        })
    })
})                     // ✔️





// -----------------------------
// START SERVER
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(port, function () {
  console.log(`Сервер API был запущен на порту ${port}! Go to ${domain}:${port}`)
})

server.listen(6567, () => {
    console.log(`Сервер API был запущен на порту ${port}`)
})
// -----------------------------
// FUNCTIONS
function newError(err) {
    console.error(err)
    let error = new Error({
        message: err
    })
    error.save().catch(err => { console.error(err) })
}
function newLog(msg) {
    console.log(msg)
    let log = new Log({
        message: msg
    })
    log.save().catch(err => { newError(err) })
}

// FUNCTIONS GET
function GetData(Model, query = {}, sort = {}, skip = 0, limit = 0) {
    return new Promise(function(resolve, reject) {
        
        Model.find(query).sort(sort).then(arr => {
            resolve(arr)
        })
        
    })
}
function GetOne(Model, query = {}, sort = {}) {
    return new Promise(function(resolve, reject) {
        Model.findOne(query).sort(sort).then(el => {
            resolve(el)
        })
    })
}
function Delete(Model, query = {}, modelName = '') {
    return new Promise(function(resolve, reject) {
        Model.deleteMany(query).then(() => {
            newLog(`Записи с модели <b>${modelName}</b> c <b>id: ${query.id}</b> удалена!`)
            resolve()
        }).catch(err => {
            newError(err)
        })
    })
}