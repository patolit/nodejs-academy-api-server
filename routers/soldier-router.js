const express = require('express')
const checkLegalID = require('../middleware/checkLegalID')
const auth = require('../middleware/auth')

const {
  getSoldiers,
  getById,
  createSoldier,
  upsertSoldier,
  modifySoldier,
  deleteSoldier,
  validate,
} = require('../controllers/soldier-controller')

const soldierRouter = express.Router()

soldierRouter.get('/', getSoldiers)
soldierRouter.get('/:id', validate('getById'), getById)
soldierRouter.post('/', validate('createSoldier'), createSoldier)
soldierRouter.put('/', validate('upsertSoldier'), upsertSoldier)
soldierRouter.patch('/:id', validate('modifySoldier'), modifySoldier)
soldierRouter.delete('/:id', validate('deleteSoldier'), deleteSoldier)

module.exports = soldierRouter
