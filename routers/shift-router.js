const express = require('express')
const shiftRouter = new express.Router()
const auth = require('./../middleware/auth')

const {
  createShift,
  deleteShift,
  modifyShift,
  validate,
} = require('../controllers/shift-controller')

shiftRouter.post('', validate('createShift'), createShift)
shiftRouter.patch('/:id', validate('modifyShift'), modifyShift)
shiftRouter.delete(':id', deleteShift)

module.exports = shiftRouter
