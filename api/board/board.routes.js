const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
  addReview,
} = require('./board.controller')
const router = express.Router()

router.get('/', log, getBoards)
router.get('/:boardId', getBoardById)
router.post('/', /*requireAuth, requireAdmin,*/ addBoard)
router.put('/:boardId', /*requireAuth, requireAdmin,*/ updateBoard)
router.delete('/:boardId', /*requireAuth, requireAdmin,*/ removeBoard)

module.exports = router
