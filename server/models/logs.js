const mongoose = require('mongoose')
const Schema = mongoose.Schema
const obj = require('../../schemas/logs')

const schema = new Schema(obj)

mongoose.model('logs', schema)