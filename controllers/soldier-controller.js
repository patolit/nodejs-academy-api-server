const InvalidSoldierParamError = require('../errors/InvalidParamError')
const InternalError = require('../errors/InvalidParamError')
const { body, param, validationResult } = require('express-validator')
const SoldiersService = require('../services/soldier-service')
const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 20

async function getSoldiers(request, response, next) {
  let { offset, limit } = request.query

  if (offset) {
    offset = parseInt(offset, 10) || DEFAULT_OFFSET
  } else {
    offset = DEFAULT_OFFSET
  }

  if (limit) {
    limit = parseInt(limit, 10) || DEFAULT_LIMIT
  } else {
    limit = DEFAULT_LIMIT
  }

  try {
    const soldier = await SoldiersService.getAllSoldiers(offset, limit)
    return response.status(200).json({ soldier, total: soldier.length })
  } catch (err) {
    next(err)
  }
}

async function getById(request, response, next) {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return next(InvalidSoldierParamError(errors.array()[0].msg))
  }

  const { id } = request.params
  const soldierId = parseInt(id, 10)
  console.log('User', request.user)
  try {
    const soldier = await SoldiersService.getSoldier(soldierId, request.user)
    if (!!soldier) {
      return response.status(200).json(soldier)
    } else {
      return response.status(404).json({ error: `no soldier with id ${soldierId}` })
    }
  } catch (e) {
    next(e)
  }
}

async function createSoldier(request, response, next) {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return next(InvalidSoldierParamError(errors.array()[0].msg))
  }

  const { title, img, synopsis, rating, year } = request.body
  const user = request.user
  const newSoldier = await SoldiersService.createSoldier(
    { title, img, synopsis, rating, year },
    user
  )
  return response.status(201).json(newSoldier)
}

async function upsertSoldier(request, response, next) {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return next(InvalidSoldierParamError(errors.array()[0].msg))
  }

  const { title, img, synopsis, rating, year } = request.body

  const soldier = await SoldiersService.getByTitle(title)
  const doesSoldierExist = !!soldier
  if (doesSoldierExist) {
    const updatedSoldier = await SoldiersService.updateSoldier(soldier.soldier_id, {
      title,
      img,
      synopsis,
      rating,
      year,
    })
    return response.status(200).json(updatedSoldier)
  } else {
    const newSoldier = await SoldiersService.createSoldier({ title, img, synopsis, rating, year })
    return response.status(201).json(newsoldier)
  }
}

async function modifySoldier(request, response, next) {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return next(InvalidSoldierParamError(errors.array()[0].msg))
  }

  const soldierId = parseInt(request.params.id)
  const soldier = await SoldiersService.getSoldier(soldierId, request.user)
  const doesSoldierExist = !!soldier

  if (!doesSoldierExist) {
    return response.status(404).json({ error: `no soldier with id ${soldierId}` })
  }

  const { title, img, synopsis, rating, year } = request.body
  const definedParams = {
    ...(title && { title }),
    ...(img && { img }),
    ...(synopsis && { synopsis }),
    ...(rating && { rating }),
    ...(year && { year }),
  }
  const patchedSoldierAtrributes = { ...soldier, ...definedParams }
  const updatedSoldier = await SoldiersService.updateSoldier(
    soldier.soldier_id,
    patchedSoldierAtrributes
  )
  return response.status(200).json(updatedSoldier)
}

async function deleteSoldier(request, response, next) {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return next(InvalidSoldierParamError(errors.array()[0].msg))
  }

  const soldierId = parseInt(request.params.id)
  const deletedSoldier = await SoldiersService.deleteSoldier(soldierId)

  if (!deletedSoldier) {
    return response.status(404).json({ error: `no soldier with id ${soldierId}` })
  }

  return response.status(200).json(deletedSoldier)
}

function validate(method) {
  switch (method) {
    case 'createSoldier': {
      return [
        body('name', "name doesn't exists").exists().isString().escape(),
        body('img', 'img is not exists or not valid url').exists().isURL(),
      ]
    }
    case 'getById': {
      return [param('id', 'Invalid id').exists().isNumeric()]
    }
    case 'deleteSoldier': {
      return [param('id', 'Invalid id').exists().isNumeric()]
    }
    case 'upsertSoldier': {
      return [
        body('name', "name doesn't exists").exists().isString().escape(),
        body('img', 'img is not exists or not valid url').exists().isURL(),
      ]
    }
    case 'modifySoldier': {
      return [
        param('id', 'Invalid id').exists().isNumeric(),
        body('name', "name doesn't exists").optional().isString().escape(),
        body('img', 'img is not exists or not valid url').optional().isURL(),
      ]
    }
    default:
      return () => {
        console.log(`no test for ${method}`)
      }
  }
}

module.exports = {
  getSoldiers,
  getById,
  createSoldier,
  upsertSoldier,
  modifySoldier,
  deleteSoldier,
  validate,
}
