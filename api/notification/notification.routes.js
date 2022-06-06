const express = require('express')
const webpush = require('web-push')

const router = express.Router()

router.post('/subscribe', (req, res) => {
  console.log('here')
  // Get pushSubscription object
  const subscription = req.body

  // Send 201 - resource created
  res.status(201).json({})

  // Create payload
  const payload = JSON.stringify({ title: 'Push Test' })

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.error(err))
})

module.exports = router
