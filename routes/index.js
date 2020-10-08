const router = require('express').Router()
const JWT = require('jsonwebtoken')
const AuthController = require('../controllers/AuthController')
const { User } = require('../models')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.use(function(req, res, next) {
  try {
    const token = JWT.verify(req.headers.token)
    User.findOne({where: {id: token.id}})
      .then(data => {
        if (data) {
          req.user = token
          next()
        } else {
          next({message: 'Please Login Again!'})
        }
      })
      
  } catch (error) {
    next(error)
  }
})

module.exports = router