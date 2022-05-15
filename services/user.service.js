const fs = require('fs')
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET1 || 'secret-ea-1984')


const utilService = require('./util.service')
const toyService = require('./toy.service')
const gUsers = require('../data/user.json');

module.exports = {
    checkLogin,
    getLoginToken,
    validateToken,
    addUser,
    userQuery,
    remove
}

function userQuery() {
    let users = gUsers
    return Promise.resolve(users)
}

function checkLogin(credentials) {
    // Check in DB for the user.
    //console.log('gUsers', gUsers);
    const user = gUsers.find(user =>
        user.username === credentials.username &&
        user.password === credentials.password)

    // Return Promise with the user
    return Promise.resolve(user)
}

// Creating a login token
function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

// Validating the login token
function validateToken(loginToken) {
    console.log('validateToken',loginToken)
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser

    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function addUser(credentials) {
    const userExists = gUsers.findIndex(user => user.username === credentials.username)
    if (userExists !== -1) return Promise.reject('User name all ready exists From backend')
    gUsers.push({
        _id: utilService.makeId(),
        fullname: credentials.fullname,
        username: credentials.username,
        password: credentials.password,
        credit: credentials.credit,
        cart:  credentials.cart,
        isAdmin: false
    })
    _saveUsersToFile()
    return Promise.resolve(credentials)
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/user.json', JSON.stringify(gUsers, null, 2), (err) => {
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

function remove(userId, loggedinUserId) {
    const idx = gUsers.findIndex(user => user._id === userId)

    if (loggedinUserId.isAdmin) {
        // Delete from JSON
        gUsers.splice(idx, 1)
        return _saveUsersToFile().then(() => gUsers)
    } else {
        return Promise.reject('Not an admin')
    }

}