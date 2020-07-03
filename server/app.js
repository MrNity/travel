// ----- Подключенные библиотеки -----
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fs = require('fs')
const http = require('http')
const https = require('https')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const axios = require('axios')

// -----------------------------
// FILES
const config = require('../config')
const port = process.env.PORT || config.PORT_SERVER
const views = __dirname + '/views/'
const API_DOMAIN = config.DOMAIN_API
const API_PORT = config.PORT_API
// -----------------------------
// START DATABASE
mongoose.connect(config.DB_URL, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true}).then (() => {
    console.log(`База данных подключена`)
}).catch((e) => {
   console.error(e)
})
// -----------------------------
// MODELS
require('./models/logs')
require('./models/errors')
// -----------------------------
// MODELS VARs
const Log = mongoose.model('logs')
const Error = mongoose.model('errors')
// -----------------------------
// APP
const app = express()
const server = http.createServer(app)
// -----------------------------
// APP SETTINGS
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.set('view engine', 'ejs')
app.use('/public', express.static('public'))
app.use(cookieParser())

app.use(session({
    secret: config.session.secret,
    key: config.session.key,
    cookie: config.session.cookie,
    resave: true, 
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))
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
// SITE STATUS ✔️
app.get('/', function (req, res) {
    res.render('index', {
        title: 'Travel Yug',
    })
})
app.get('/destinations', function (req, res) {
    res.render('destinations', {
        title: 'Travel Yug | Направления',
    })
})
app.get('/place/:id', function (req, res) {
    let id = +req.params.id
    
    axios.get(`http://localhost:6567/points/${id}`).then(resolve => {
        let data = resolve.data
        
        res.render('place', {
            title: `Travel Yug | Точка №${id}`,
            data
        })
    })
})

app.use(function(req, res, next) {
    res.status(404).render('404')
})
// -----------------------------
// START SERVER

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(443, function () {
  console.log('Example app listening on port 3000! Go to https://localhost:3000/')
})

server.listen(port, () => {
    console.log(`Сервер был запущен на порту ${port}`)
})
// -----------------------------
// FUNCTIONS
function newError(err, bot = false) {
    if (!bot) {
        let error = new Error({
            date: new Date(),
            message: err
        })
        error.save().catch(err => { newError(err) })
    } else {
        let error = new Error({
            date: new Date(),
            message: err,
            bot: true
        })
        error.save().catch(err => { newError(err, true) })
    }
}
function newLog(msg, bot = false) {
    console.log(msg)
    if (!bot) {
        let log = new Log({
            date: new Date(),
            message: msg
        })
        log.save().catch(err => { newError(err) })
    } else {
        let log = new Log({
            date: new Date(),
            message: msg,
            bot: true
        })
        log.save().catch(err => { newError(err, true) })
    }
}