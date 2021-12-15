const { body, validationResult } = require('express-validator')
const InvalidParamError = require('./../errors/InvalidParamError')
const ShiftService = require('./../services/shift-service')

async function createShift(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(InvalidParamError(errors.array()[0].msg))
  }

  const { name, repetition, duration, peoplePerShift, start, end } = req.body
  try {
    const shift = await ShiftService.createShifta(
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
    return next(InvalidMovieParamError(errors.array()[0].msg))
  }

  const shiftName = parseInt(request.params.name)
  const shift = await ShiftService.findShifta(shiftName)
  const doesShiftExist = !!shift

  if (!doesShiftExist) {
    return response.status(404).json({ error: `no shift with name ${shiftName}` })
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
  const updatedShift = await ShiftService.updateShifta(shift._id, patchedShiftAtrributes)
  return response.status(200).json(updatedShift)
}

async function deleteShift(req, res, next) {
  try {
    const countDeleted = await ShiftService.deleteshifta(req.shift)
    if (countDeleted > 0) {
      res.status(200).send({ uses: req.shift })
    } else {
      throw Error(`Failed to delete shift ${req.shift.id}`)
    }
  } catch (e) {
    next(e)
  }
}

function validate(method) {
  switch (method) {
    case 'createUser': {
      return [
        body('email', 'email dosnt exists or invalid').exists().isEmail(),
        body('name', 'name dosnt not exists or invalid').exists().isString().escape(),
        body('password', "password doesn't exists").exists().isString(),
      ]
    }
  }
}

module.exports = { createShift, deleteShift, modifyShift, validate }
