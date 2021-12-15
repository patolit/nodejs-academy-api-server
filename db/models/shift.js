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

const shiftSchema = new Schema({
    shift_id: Number,
    name: String, // {type: String}
    repetition: String,
    duration: Number,
    peoplePerShift: Number,
    start: Number,
    end:Number
})



const Shift = mongoose.model('Shift', shiftSchema)

module.exports = Shift