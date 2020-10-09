const bcrypt = require('bcrypt')
const Joi = require('joi')
const { User } = require('../models')

module.exports = class UserController {
  static async view(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['firstName', 'lastName', 'birthYear', 'email']
      })
      
      return res.status(200).json({
        message: 'Okay!',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }
  static async update(req,  res, next) {
    try {
      const schema = Joi.object().keys({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().optional(),
        birthYear: Joi.number().optional(),
      })

      const validate = schema.validate(req.body)
      if (validate.error) return res.status(422).json({message: validate.error.message, status: false})

      const { firstName, lastName, email, birthYear } = req.body

      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'birthYear']
      })

      if (!user) return res.status(404).json({
        message: "User unknown!",
        status: false
      })

      try {
        await user.update(req.body)
      } catch (error) {
        throw new Error('Update error!')
      }
      
      return res.status(200).json({
        message: "User updated!",
        data: user
      })
    } catch (error) {
      next(error)
    }
  }
  static async destroy(req, res, next) {
    try {
      
    } catch (error) {
      next(error)
    }
  }
  static async password(req, res, next) {}
}