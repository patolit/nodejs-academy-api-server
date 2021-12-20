const express = require('express')
const shiftRouter = new express.Router()
const auth = require('./../middleware/auth')

const {
  createShift,
  getShifts,
  deleteShift,
  modifyShift,
  validate,
} = require('../controllers/shift-controller')

shiftRouter.get('/', getShifts)
shiftRouter.post('/', validate('createShift'), createShift)
shiftRouter.patch('/:name', validate('modifyShift'), modifyShift)
shiftRouter.delete('/:id', deleteShift)

module.exports = shiftRouter
