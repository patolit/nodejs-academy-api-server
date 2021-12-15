const express = require('express')
const checkLegalID = require('../middleware/checkLegalID')
const auth = require('./../middleware/auth')

const {
  getMovies,
  getById,
  createMovie,
  upsertMovie,
  modifyMovie,
  deleteMovie,
  validate,
} = require('../controllers/movies-controller')

const moviesRouter = express.Router()

moviesRouter.get('/',  getMovies)
moviesRouter.get('/:id', validate("getById"), getById)
moviesRouter.post('/',  validate('createMovie'), createMovie)
moviesRouter.put('/',  validate('upsertMovie'), upsertMovie)
moviesRouter.patch('/:id',  validate('modifyMovie'), modifyMovie)
moviesRouter.delete('/:id',  validate('deleteMovie'), deleteMovie)

module.exports = moviesRouter
