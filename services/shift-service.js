const Shift = require('../db/models/shift')
const daysToCalculate = process.env.CONFIG_TIME_PERIOD_DAYS

function calculateSchedules(repetition, duration, peoplePerShift, start) {
  switch (repetition) {
    case '24': {
      //shift in 24 hours
      const scheduleSlotsInDay = Math.ceil(24 / parseInt(duration))
      const scheduleSlotsToCalculate = scheduleSlotsInDay * daysToCalculate
      const startDate = Date.parse(start)
      console.log(startDate)
      return
    }
    case 'once': {
      return
    }
  }
}

async function createShift(name, repetition, duration, peoplePerShift, start, end = null) {
  const shift = new Shift({ name, repetition, duration, peoplePerShift, start, end })
  const savedShift = await shift.save()

  // parse Shift, how many schedules are needed?
  const requiredSchedules = calculateSchedules(repetition, duration, peoplePerShift, start)
  // create array of schedules
  // create many unassigned schedules
  // return shift + unassigned schedules
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
