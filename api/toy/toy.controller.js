const toyService = require('./toy.service.js');
const logger = require('../../services/logger.service')
const socketService = require('../../services/socket.service')

// GET LIST
async function getToys(req, res) {
  try {
    logger.debug('Getting Toys')
    var queryParams = req.query || {}
    const toys = await toyService.query(JSON.parse(queryParams.filterBy))
    res.json(toys);
  } catch (err) {
    logger.error('Failed to get toys', err)
    res.status(500).send({ err: 'Failed to get toys' })
  }
}

// GET BY ID 
async function getToyById(req, res) {
  try {
    const toyId = req.params.toyId;
    const toy = await toyService.getById(toyId)
    res.json(toy)
  } catch (err) {
    logger.error('Failed to get toy', err)
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

// POST (add toy)
async function addToy(req, res) {
  try {
    const toy = req.body;
    const addedToy = await toyService.add(toy)
    // res.json(addedToy)
    res.send(addedToy)
  } catch (err) {
    logger.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

// PUT (Update toy)
async function updateToy(req, res) {
  try {
    const toy = req.body;
    const updatedToy = await toyService.update(toy)
    res.json(updatedToy)
    // socketService.broadcast({type: 'toy-edited', data: toy, userId: toy._id})

  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })

  }
}

// DELETE (Remove toy)
async function removeToy(req, res) {
  try {
    const toyId = req.params.toyId;
    const removedId = await toyService.remove(toyId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

module.exports = {
  getToys,
  getToyById,
  addToy,
  updateToy,
  removeToy
}
