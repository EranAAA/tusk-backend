
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')
// const axios = require('axios')
// require('dotenv').config()

// const universalCookie = require('universal-cookie')

const toyService = require('./services/toy.service')
const userService = require('./services/user.service')
const app = express()

// Config the Express App
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
  } else {
    const corsOptions = {
      origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
      credentials: true
    }
    app.use(cors(corsOptions))
  }
app.use(express.static('public')) // Load the public folder (th e fornt end)
app.use(cookieParser()) // Manage Cookies
app.use(express.json()) // What is doing? It parses incoming JSON requests and puts the parsed data in req.body.

// Rest: Get the toy json from service
// app.get('/api/toy/filter/:filterBy?', (req, res) => {
app.get('/api/toy/filter/:filterBy?', (req, res) => {
    const filterBy = JSON.parse(req.params.filterBy) || ''
    toyService.query(filterBy)
        .then(toys => {
            res.send(toys)
            // console.log(toys);
        })
})

// Rest: Post new toy
app.post('/api/toy', (req, res) => {

    // const cookies = new universalCookie(req.headers.cookie);
    // const loggedinUser = userService.validateToken(cookies.get('loginToken'))
    // if (!loggedinUser) return res.status(401).send('Cannot add Toy')

    // After we pass the checking we add the Toy.
    // over here we take the Toy Obj from url body.
    const toy = req.body

    // Save the Toy with service and send back the saved toy to fornt.
    toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
})

// Rest: Put Update toy
app.put('/api/toy/:toyId', (req, res) => {

    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update Toy')

    // After we pass the checking we update the Toy.
    // over here we take the Toy Obj from url body.
    const toy = req.body
    toyService.save(toy, loggedinUserId = {isAdmin: true})
        .then((savedToy) => {
            res.send(savedToy)
        }).catch(err => {
            res.status(401).send('Cannot update toy!')
        })
})

// Rest: Get toy from service
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId)
        .then(toy => {
            res.send(toy)
        })
})

// Rest: Delete toy from service
app.delete('/api/toy/:toyId', (req, res) => {

    // const cookies = new universalCookie(req.headers.cookie);
    // const loggedinUser = userService.validateToken(cookies.get('loginToken'))
    // if (!loggedinUser) return res.status(401).send('Cannot delete Toy')

    // After we pass the checking we delete the Toy.
    const { toyId } = req.params

    //HERE WE HANDLE THE PREMMISION IN SERVICE!
    toyService.remove(toyId, loggedinUserId = {isAdmin: true})
        .then(() => {
            res.send('Removed Succesfully')
        })
        .catch(err => {
            res.status(401).send('Cannot delete toy')
        })
})

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

// USER & Auth API:

// Rest: Get the user json from service
app.get('/api/users', (req, res) => {
    userService.userQuery()
        .then(users => {
            res.send(users)
        })
})

// Rest: Delete user from service
app.delete('/api/users/:userId', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete User')

    // After we pass the checking we delete the Toy.
    const { userId } = req.params

    //HERE WE HANDLE THE PREMMISION IN SERVICE!
    userService.remove(userId, loggedinUser)
        .then((users) => {
            res.send(users)
        })
        .catch(err => {
            res.status(401).send('Cannot delete toy')
        })
})

// Rest: Post login WHY NOT GET?
app.post('/api/login', (req, res) => {
    // get the ID fro Request
    const credentials = req.body
    console.log('Credentials: login', credentials)

    // Checking login in service: get the UNCRYPT credentials and 
    // check if there is user in DB in user.service and return user if true
    userService.checkLogin(credentials)
        .then(user => {
            if (user.username === credentials.username &&
                user.password === credentials.password) {
                // loginToken: send back a cookie with user token
                const loginToken = userService.getLoginToken(user)

                // const cookies = new universalCookie(req.headers.cookie);
                // cookies.set('loginToken', loginToken, { path: '/' });
                // console.log(cookies.get('loginToken'));
                res.cookie('loginToken', loginToken)
                // console.log('loginToken', req.cookies.loginToken);
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

// Rest: Post Signup
app.post('/api/signup', (req, res) => {
    // get the ID fro Request
    const credentials = req.body
    console.log('Credentials: signup', credentials)

    // Checking login in service: get the UNCRYPT credentials and 
    // check if there is user in DB in user.service and return user if true
    userService.addUser(credentials)
        .then(user => {
            if (user) {
                // loginToken: send back a cookie with user token
                const loginToken = userService.getLoginToken(user)
                // const cookies = new universalCookie(req.headers.cookie);
                // cookies.set('loginToken', loginToken, { path: '/' });
                // console.log(cookies.get('loginToken'));

                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        }).catch(err => {
            console.log('err', err);
        })
})

// Rest: Post logout WHY NOT GET?
app.post('/api/logout', (req, res) => {
    // Clear cookies
    res.clearCookie('loginToken')
    res.send('Logged out')
})

const port = process.env.PORT || 3030;

// Fallback to route undefine
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});