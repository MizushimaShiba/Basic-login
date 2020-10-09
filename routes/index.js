const router = require('express').Router()
const JWT = require('jsonwebtoken')
const AuthController = require('../controllers/AuthController')
const UserController = require('../controllers/UserController')
const { User } = require('../models')

router.get('/', (req, res) => {
  if (req.headers.token) {
    const token = JWT.verify(req.headers.token, process.env.JWT_KEY)
    if (token) {
      User.findOne({where: {id: token.id}})
      .then(data => {
        if (data) {
          req.user = token
          next()
        } else {
          next({message: 'Please Login Again!'})
        }
      })
    }
  } else res.redirect('/login')
})

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.use(function(req, res, next) {
  try {
    const token = JWT.verify(req.headers.token, process.env.JWT_KEY)
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

router.get('/profile', UserController.view)
router.put('/profile', UserController.update)


module.exports = router