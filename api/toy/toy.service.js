const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
   try {

      const stock = (filterBy.stock === 'true') ? true : ((filterBy.stock === 'false') ? false : '')

      const collection = await dbService.getCollection('toy')
      var toys = await collection.find(stock && ({ inStock: stock })).toArray()
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
      console.log('toy', toy);
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
   // if (filterBy.name) {
   //     const nameCriteria = { $regex: filterBy.name, $options: 'i' }
   //     criteria.name = { nameCriteria } 
   // }

   if (filterBy.stock) {
      criteria.stock = { $gte: filterBy.minBalance }
   }

   return criteria
}

// if (filterBy) {
//    if (filterBy.name) toys = toys.filter(toy => toy.name.includes(filterBy.name))
//    if (filterBy.stock === 'true' || filterBy.stock === 'false') {
//        toys = toys.filter(toy => {
//            const isInStock = toy.inStock ? 'true' : 'false'
//            return isInStock === filterBy.stock
//        })
//    }
//    const selectedOption = filterBy.selectedOption ? filterBy.selectedOption.map(({value,...rest}) => value) : []
//    if (selectedOption.length) toys = toys.filter(toy => toy.labels.join(' ').includes(selectedOption.join(' ')))
//    if (filterBy.sort === 'Lower') toys = toys.sort((a, b) => a.price - b.price)
//    if (filterBy.sort === 'Higher') toys = toys.sort((a, b) => b.price - a.price)
//    if (filterBy.sort === 'Newest') toys = toys.sort((a, b) => b.createdAt - a.createdAt)
//    if (filterBy.sort === 'Oldest') toys = toys.sort((a, b) => a.createdAt - b.createdAt)
// } else {
//    toys = toys.sort((a, b) => b.createdAt - a.createdAt)
// }

module.exports = {
   remove,
   query,
   getById,
   add,
   update,
}