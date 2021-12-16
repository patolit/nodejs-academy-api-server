const Shift = require('../db/models/shift')

async function createShift(name, repetition, duration, peoplePerShift, start, end = null) {
  const shift = new Shift({ name, repetition, duration, peoplePerShift, start, end })
  const savedUser = await shift.save()
  return shift
}

async function modifyShift(id, { name, repetition, duration, peoplePerShift, start, end }) {
  const newShiftObject = await Shift.findOneAndUpdate(
    { _id: id },
    { name, repetition, duration, peoplePerShift, start, end },
    { new: true }
  )
  return newShiftObject
}

async function getAllShifts() {
  const shifts = await Shift.find()
  return shifts
}

async function findShift(name) {
  const shift = await Shift.findOne({ name })
  return shift
}

async function deleteShift(shift) {
  const result = await Shift.deleteOne({ _id: shift._id })
  return result.deletedCount
}

module.exports = {
  getAllShifts,
  createShift,
  modifyShift,
  findShift,
  deleteShift,
}
