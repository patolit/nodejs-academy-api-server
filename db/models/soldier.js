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

const soldierSchema = new Schema({
  soldier_id: Number,
  name: String, // {type: String}
  img: String,
})

module.exports = mongoose.model('Soldier', soldierSchema)
