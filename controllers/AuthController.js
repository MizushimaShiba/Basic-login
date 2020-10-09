const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { User } = require('../models')

module.exports = class AuthController {
    static async register(req, res, next) {
        try {
            const schema = Joi.object().keys({
                email: Joi.string().required(),
                password: Joi.string().required(),
                name: Joi.string().required(),
                gender: Joi.string().required().valid('male', 'female'),
                birthYear: Joi.number().required(),
            })

            const validate = schema.validate(req.body)

            if (validate.error) return res.status(422).json({message: validate.error.message, status: false})

            const isEmailAlready = await User.findOne({where: {email: req.body.email}})

            if (isEmailAlready) return res.status(403).json({message: 'Email sudah terdaftar!', status: false})

            req.body.firstName = req.body.name.split(' ')[0]
            req.body.lastName = req.body.name.split(' ')[1]

            delete req.body.name

            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt);


            const result = await User.create(req.body)
            delete result.dataValues.password
            delete result.dataValues.createdAt
            delete result.dataValues.updatedAt


            const token = jwt.sign(result.dataValues, process.env.JWT_KEY, {
                expiresIn: '15h'
            })
            result.dataValues.token = token
            
            return res.status(200).json({
                message: 'Register success!',
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            const schema = Joi.object().keys({
                email: Joi.string().required(),
                password: Joi.string().required()
            })

            const validate = schema.validate(req.body)
            if (validate.error) return res.status(422).json({message: validate.error.message, status: false})

            const user = await User.findOne({
                where: {
                    email: req.body.email
                }
            })

            if (!user) return res.status(404).json({message: 'Email and / or password Error'})
            const compared = await bcrypt.compareSync(req.body.password, user.password)
            if (!compared) return res.status(404).json({message: 'Email and / or password Error'})
            delete user.dataValues.password
            delete user.dataValues.createdAt
            delete user.dataValues.updatedAt
            delete user.dataValues.birthYear

            const token = jwt.sign(user.dataValues, process.env.JWT_KEY, {
                expiresIn: '15h'
            })

            user.dataValues.token = token
            return res.status(200).json({
                message: 'Success!',
                data: user
            })
        } catch (error) {
            next(error)
        }
    }

}