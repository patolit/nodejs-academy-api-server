//const INITIAL_MOVIES = require('./movies.json')
const { loadAllData, Movie } = require('../db/')
const InternalError = require('../errors/InternalError')
const Unauthorized = require('../errors/UnauthorizedError')
//process.env.RESET_DB && loadAllData(INITIAL_MOVIES.movies)

async function getAllMovies(offset, limit) {
  const request = Movie.find()
  if (offset) {
    request.skip(offset)
  }
  if (limit) {
    request.limit(limit)
  }
  return request
}

async function updateMovie(id, { title, img, synopsis, rating, year }) {
  const newMovieObject = await Movie.findOneAndUpdate(
    { movie_id: id },
    { title, img, synopsis, rating, year },
    { new: true }
  )
  return newMovieObject
}

async function getMovie(movieId, user) {
  const movie = await Movie.findOne({ movie_id: movieId })
  if (!movie) return
  //return movies that are public
  if (!movie.owner) return movie

  if (movie.owner.equals(user._id)) {
    return movie
  } else {
    throw Unauthorized(`Unauthorized to get access to movie ${movieId}`)
  }
}

async function getByTitle(title) {
  const movie = await Movie.findOne({ title })
  return movie
}

async function createMovie({ title, img, synopsis, rating, year }, user) {
  const nextMovieId = await getNextMovieId()
  const movie = new Movie({ title, img, synopsis, rating, year, movie_id: nextMovieId })
  movie.save()
  return movie
}

async function deleteMovie(id) {
  const deletedMovie = await Movie.findOneAndDelete({ movie_id: id })
  return deletedMovie
}

async function getNextMovieId() {
  const lastMovie = await Movie.findOne({}, {}, { sort: { movie_id: -1 } })
  return ++lastMovie.movie_id
}

module.exports = { getAllMovies, getMovie, getByTitle, createMovie, updateMovie, deleteMovie }
