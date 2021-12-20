const { body, validationResult, oneOf } = require('express-validator')
const InvalidParamError = require('./../errors/InvalidParamError')
const ShiftService = require('./../services/shift-service')

async function getShifts(req, res, next) {
  try {
    const shifts = await ShiftService.getAllShifts()
    return res.status(200).json({ shifts, total: shifts.length })
  } catch (err) {
    next(err)
  }
}

async function createShift(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(InvalidParamError(errors.array()[0].msg))
  }

  const { name, repetition, duration, peoplePerShift, start, end } = req.body
  try {
    const shift = await ShiftService.createShift(
      name,
      repetition,
      duration,
      peoplePerShift,
      start,
      end
    )
    console.log('shift', shift)
    res.status(201).send({ shift })
  } catch (e) {
    next(e)
  }
}

async function modifyShift(request, response, next) {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return next(InvalidParamError(errors.array()[0].msg))
  }

  const { name } = request.params
  const shift = await ShiftService.findShift(name)
  const doesShiftExist = !!shift

  if (!doesShiftExist) {
    return response.status(404).json({ error: `no shift with name ${name}` })
  }

  const { repetition, duration, peoplePerShift, start, end } = request.body
  const definedParams = {
    ...(duration && { duration }),
    ...(repetition && { repetition }),
    ...(duration && { duration }),
    ...(peoplePerShift && { peoplePerShift }),
    ...(start && { start }),
    ...(end && { end }),
  }
  const patchedShiftAtrributes = { ...shift, ...definedParams }
  const updatedShift = await ShiftService.modifyShift(shift._id, patchedShiftAtrributes)
  return response.status(200).json(updatedShift)
}

async function deleteShift(req, res, next) {
  try {
    const countDeleted = await ShiftService.deleteshift(req.shift)
    if (countDeleted > 0) {
      res.status(200).send({ shift: req.shift })
    } else {
      throw Error(`Failed to delete shift ${req.shift.id}`)
    }
  } catch (e) {
    next(e)
  }
}

function validate(method) {
  switch (method) {
    case 'createShift': {
      return [
        body('name', 'name dosnt exists or invalid').exists().isString(),
        body('repetition', 'repetition dosnt not exists or invalid').exists().isString().escape(),
        body('duration', "duration doesn't exists").exists().isNumeric(),
        body('peoplePerShift', "peoplePerShift doesn't exists").exists().isString(),
        body('start', "start doesn't exists").exists().isString(),
        body('end', "end doesn't exists").isString(),
      ]
    }
    case 'modifyShift': {
      return [
        //param('name', 'name dosnt exists or invalid').exists().isString(),
        body('repetition', 'repetition dosnt not exists or invalid').optional().isString().escape(),
        body('duration', "duration doesn't exists").optional().isNumeric(),
        body('peoplePerShift', "peoplePerShift doesn't exists").optional().isString(),
        body('start', "start doesn't exists").optional().isString(),
        body('end', "end doesn't exists").optional().isString(),
      ]
    }
    default:
      return () => console.log('no case for you')
  }
}

module.exports = { getShifts, createShift, modifyShift, validate, deleteShift }
