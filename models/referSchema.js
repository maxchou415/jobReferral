const mongoose = require('mongoose')
const shortId = require('shortid')
const moment = require('moment')
const config = require('config')

const database = config.get('database')

mongoose.createConnection(`mongodb://${database}`)

const Schema = mongoose.Schema

const Time = moment().format('LLLL')

const referSchema = new Schema({

    name: { type: String },
		promoMessage: { type: String },
		resumeUrl: { type: String },
		position: { type: String },

		status: { type: Number, default: 0 },
		// 0 = not process yet
		// 1 = in interview
		// 2 = Success
		// 3 = Failed
    
    created_by: { type: String },
    _id: { type: String, default: shortId.generate },

    created_at: { type: Date, default: Time }
})


module.exports = mongoose.model('refer', referSchema)
