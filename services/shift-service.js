const Shift = require('../db/models/shift')

async function createShifta(name, repetition, duration, peoplePerShift, start, end = null) {
  const shift = new Shift({ name, repetition, duration, peoplePerShift, start, end })
  const savedUser = await shift.save()
  return shift
}

async function modifyShifta(id, { name, repetition, duration, peoplePerShift, start, end }) {
  const newShiftObject = await Shift.findOneAndUpdate(
    { _id: id },
    { name, repetition, duration, peoplePerShift, start, end },
    { new: true }
  )
  return newShiftObject
}

async function findShifta(name) {
  const shift = await User.findOne(name)
  return shift
}

async function deleteShifta(shift) {
  const result = await User.deleteOne({ _id: shift.id })
  return result.deletedCount
}

module.exports = {
  createShifta,
  modifyShifta,
  findShifta,
  deleteShifta,
}
