
const fs = require('fs')
const utilService = require('./util.service')
const gToys = require('../data/toy.json')

module.exports = {
    query,
    getById,
    remove,
    save,
    //isUsersGotToys
}

function query(filterBy) {
    let toys = gToys

    if (filterBy) {
        if (filterBy.name) toys = toys.filter(toy => toy.name.includes(filterBy.name))
        if (filterBy.stock === 'true' || filterBy.stock === 'false') {
            toys = toys.filter(toy => {
                const isInStock = toy.inStock ? 'true' : 'false'
                return isInStock === filterBy.stock
            })
        }
        const selectedOption = filterBy.selectedOption ? filterBy.selectedOption.map(({value,...rest}) => value) : []
        if (selectedOption.length) toys = toys.filter(toy => toy.labels.join(' ').includes(selectedOption.join(' ')))
        if (filterBy.sort === 'Lower') toys = toys.sort((a, b) => a.price - b.price)
        if (filterBy.sort === 'Higher') toys = toys.sort((a, b) => b.price - a.price)
        if (filterBy.sort === 'Newest') toys = toys.sort((a, b) => b.createdAt - a.createdAt)
        if (filterBy.sort === 'Oldest') toys = toys.sort((a, b) => a.createdAt - b.createdAt)
    } else {
        toys = toys.sort((a, b) => b.createdAt - a.createdAt)
    }

    return Promise.resolve(toys)
}

function getById(toyId) {
    const toy = gToys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId, loggedinUserId) {
    const idx = gToys.findIndex(toy => toy._id === toyId)
    // Check if the creator id of the toy he is the loged user that try to delete the toy
    if (loggedinUserId.isAdmin) {
        // Delete from JSON
        gToys.splice(idx, 1)
        return _saveToysToFile()
    } else {
        return Promise.reject('Not your Toy')
    }

}

function save(toy, loggedinUserId) {
    if (loggedinUserId.isAdmin) {
        if (toy._id) {
            const idx = gToys.findIndex(currToy => currToy._id === toy._id)
            gToys[idx] = toy
        } else {
            toy._id = utilService.makeId()
            gToys.push(toy)
        }
    } else {
        return Promise.reject('Not your Toy')
    }
    
    return _saveToysToFile().then(() => toy)
}

// function isUsersGotToys(userId) {
//     const isGotToys = gToys.some(toy => toy.creator._id === userId)
//     return isGotToys
// }

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/toy.json', JSON.stringify(gToys, null, 2), (err) => {
            if (err) {
                console.log(err);
                reject('Cannot write to file')
            } else {
                console.log('Wrote Successfully!')
                resolve()
            }
        })
    })
}