const mongoose = require('mongoose')
const shortId = require('shortid')
const moment = require('moment')
const config = require('config')

const database = config.get('database')

mongoose.connect(`mongodb://${database}`)

const Schema = mongoose.Schema

const Time = moment().format('LLLL')

const usersSchema = new Schema({

    name: { type: String },
		username: { type: String },
		password: { type: String },
		email: { type: String },
		role: { type: Number, default: 1 },

    _id: { type: String, default: shortId.generate },

    created_at: { type: Date, default: Time }
})


module.exports = mongoose.model('users', usersSchema)
