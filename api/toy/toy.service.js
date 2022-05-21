const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
   try {
      const criteria = _buildCriteria(filterBy)
      const criteriaSort = _buildCriteriaSort(filterBy)
      const collection = await dbService.getCollection('toy')

      var toys = await collection.find(criteria).sort(criteriaSort).toArray()
      return toys
   } catch (err) {
      logger.error('cannot find toys', err)
      throw err
   }
}

async function getById(toyId) {
   try {
      const collection = await dbService.getCollection('toy')
      const toy = collection.findOne({ _id: ObjectId(toyId) })
      // console.log('toy', toy);
      return toy
   } catch (err) {
      logger.error(`while finding toy ${toyId}`, err)
      throw err
   }
}

async function remove(toyId) {
   try {
      const collection = await dbService.getCollection('toy')
      await collection.deleteOne({ _id: ObjectId(toyId) })
      return toyId
   } catch (err) {
      logger.error(`cannot remove toy ${toyId}`, err)
      throw err
   }
}

async function add(toy) {
   try {
      const collection = await dbService.getCollection('toy')
      const addedToy = await collection.insertOne(toy)
      return addedToy.ops[0]
   } catch (err) {
      logger.error('cannot insert toy', err)
      throw err
   }
}

async function update(toy) {
   try {
      var id = ObjectId(toy._id)
      delete toy._id
      const collection = await dbService.getCollection('toy')
      await collection.updateOne({ _id: id }, { $set: { ...toy } })
      return toy
   } catch (err) {
      logger.error(`cannot update toy ${toyId}`, err)
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