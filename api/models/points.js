const mongoose = require('mongoose')
const Schema = mongoose.Schema
const obj = require('../../schemas/points')

const schema = new Schema(obj)

mongoose.model('points', schema)