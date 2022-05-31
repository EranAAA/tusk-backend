const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
   try {
      const criteria = _buildCriteria(filterBy)
      const criteriaSort = _buildCriteriaSort(filterBy)
      const collection = await dbService.getCollection('board')

      console.log('query', collection);

      var boards = await collection.find(criteria).sort(criteriaSort).toArray()
      return boards
   } catch (err) {
      logger.error('cannot find boards', err)
      throw err
   }
}

async function getById(boardId) {

   try {
      const collection = await dbService.getCollection('board')
      const board = collection.findOne({ _id: ObjectId(boardId) })
      // const board = collection.findOne({ _id: (boardId) })
      // console.log('board', board);
      return board
   } catch (err) {
      logger.error(`while finding board ${boardId}`, err)
      throw err
   }
}

async function remove(boardId) {
   try {
      const collection = await dbService.getCollection('board')
      await collection.deleteOne({ _id: ObjectId(boardId) })
      return boardId
   } catch (err) {
      logger.error(`cannot remove board ${boardId}`, err)
      throw err
   }
}

async function add(board) {
   try {
      const collection = await dbService.getCollection('board')
      const addedBoard = await collection.insertOne(board)
      return addedBoard.ops[0]
   } catch (err) {
      logger.error('cannot insert board', err)
      throw err
   }
}

async function update(board) {
   try {
      var id = ObjectId(board._id)
      delete board._id
      const collection = await dbService.getCollection('board')
      await collection.updateOne({ _id: id }, { $set: { ...board } })
      return board
   } catch (err) {
      logger.error(`cannot update board ${boardId}`, err)
      throw err
   }
}

function _buildCriteria(filterBy) {

   const criteria = {}
   const selectedOption = filterBy.selectedOption ? filterBy.selectedOption.map(({ value, ...rest }) => value) : []

   if (filterBy.name) {
      criteria.name = { $regex: filterBy.name, $options: 'i' }
   }

   if (filterBy.stock || filterBy.stock === false) {
      criteria.inStock = filterBy.stock
   }

   // if (filterBy.selectedOption) {
   //    criteria.labels = { selectedOption }
   // }

   // console.log('criteria', criteria);
   console.log('filterBy', filterBy);

   return criteria
}

function _buildCriteriaSort(filterBy) {

   const criteria = {}

   if (filterBy.sort === 'Higher') {
      criteria.price = -1
   }

   if (filterBy.sort === 'Lower') {
      criteria.price = 1
   }

   if (filterBy.sort === 'Newest') {
      criteria.createdAt = -1
   }

   if (filterBy.sort === 'Oldest') {
      criteria.createdAt = 1
   }

   if (!Object.keys(criteria).length) {
      criteria.createdAt = -1
   }

   //console.log('criteriaSort', criteria);

   return criteria
}

module.exports = {
   remove,
   query,
   getById,
   add,
   update,
}