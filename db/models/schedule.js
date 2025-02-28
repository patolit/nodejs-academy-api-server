const mongoose = require('mongoose')
const { Schema } = mongoose

// String
// Number
// Boolean | Bool
// Array
// Buffer
// Date
// ObjectId | Oid
// Mixed

// https://mongoosejs.com/docs/api.html#schema_Schema.Types

const schedule = new Schema({
  shift_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Shift',
  },
  soldierAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  },
  start: Date,
  end: Date,
})

module.exports = mongoose.model('Schedule', schedule)
