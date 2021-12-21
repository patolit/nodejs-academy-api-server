const INITIAL_SOLDIER = require('./soldier.json')
const { loadAllData, Soldier } = require('../db')
const InternalError = require('../errors/InternalError')
const Unauthorized = require('../errors/UnauthorizedError')
process.env.RESET_DB && loadAllData(INITIAL_SOLDIER.soldiers)

async function getAllSoldiers(offset, limit) {
  const request = Soldier.find()
  if (offset) {
    request.skip(offset)
  }
  if (limit) {
    request.limit(limit)
  }
  return request
}

async function updateSoldier(id, { name, img }) {
  const newSoldierObject = await Soldier.findOneAndUpdate(
    { soldier_id: id },
    { name, img },
    { new: true }
  )
  return newSoldierObject
}

async function getSoldier(soldierId, user) {
  const soldier = await Soldier.findOne({ soldier_id: soldierId })
  if (!soldier) return
  return soldier
}

async function getByName(name) {
  const soldier = await Soldier.findOne({ name })
  return soldier
}

async function createSoldier({ name, img }) {
  const nextSoldierId = await getNextSoldierId()
  const soldier = new Soldier({ name, img, soldier_id: nextSoldierId })
  soldier.save()
  return soldier
}

async function deleteSoldier(id) {
  const deletedSoldier = await Soldier.findOneAndDelete({ soldier_id: id })
  return deletedSoldier
}

async function getNextSoldierId() {
  const lastSoldier = await Soldier.findOne({}, {}, { sort: { soldier_id: -1 } })
  return ++lastSoldier.soldier_id
}

module.exports = {
  getAllSoldiers,
  getSoldier,
  getByName,
  createSoldier,
  updateSoldier,
  deleteSoldier,
}
