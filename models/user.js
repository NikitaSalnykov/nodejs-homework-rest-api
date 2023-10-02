const { Schema, model } = require('mongoose')
const Joi = require('joi')
const { handleMangooseErr } = require('../helpers')

const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(  {
  password: {
    type: String,
    minlength: 6,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: emailValidation,
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String
},
  {
    versionKey: false,
    timestamps: true
  })

userSchema.post("save", handleMangooseErr)

const registerSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailValidation).required(),
  password: Joi.string().min(6).required()
})
 
const loginSchema = Joi.object({
  email: Joi.string().pattern(emailValidation).required(),
  password: Joi.string().min(6).required()
})
  
const schemas = {
  registerSchema,
  loginSchema
}

const User = model('user', userSchema)

module.exports = {
  User,
  schemas
}
