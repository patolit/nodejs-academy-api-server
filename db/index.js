const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const models = {}

fs.readdirSync(path.join(__dirname, 'models'))
  .filter((file) => file.slice(-3) === '.js')
  .forEach((file) => {
    const modelPath = path.join(__dirname, 'models', file)
    console.log(` 🍃 Loading - DB::MODEL::${modelPath}`)
    const model = require(modelPath)
    models[model.modelName] = model
  })

const connect = async () => {
  const { DB_USER, DB_PASS, DB_HOST } = process.env
  return mongoose
    .connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/moviesDb?retryWrites=true&w=majority`)
    .then(() => console.log(` 🍃 mongo-db connected`))
    .catch(console.log)
}

const loadAllData = function (soldierssJson) {
  const { Soldier } = models
  if (Array.isArray(soldierssJson)) {
    Soldier.collection
      .deleteMany({})
      .then(console.log)
      .then(Soldier.collection.insertMany(soldierssJson))
      .then(() => console.log(' 🍃  db reset done '))
      .catch(console.log)
  } else {
    throw new Error('Soldier::Insert expected soldierssJson to be array of movies')
  }
}

connect()

module.exports = { db: mongoose, ...models, connect, loadAllData }
