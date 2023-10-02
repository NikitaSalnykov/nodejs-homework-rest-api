const { User } = require('../models/user')
const {HttpError} = require('../helpers')
const ctrlWrapper = require('../helpers/ctrlWrapper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv'). config()

const {SECRET_KEY} = process.env

const register = async (req, res) => {
  const { email, password} = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use")
  }

  const hashPassword = await bcrypt.hash(password, 10)

  const newUser = await User.create({...req.body, password: hashPassword})

  res.status(201).json({
    user: {
      email: newUser.email, subscription: newUser.subscription
    }
  })
}

const login = async (req, res) => { 
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) { 
     throw HttpError(401, "Email or password is wrong")
  }

  const passwordCompare = bcrypt.compare(password, user.password)

  if (!passwordCompare) { 
     throw HttpError(401, "Email or password is wrong")
  }

  const payload = {
    id: user._id
  }

  const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '24h'})

  res.json({
    token,
    user: {email, password}
  })

}

module.exports = {
  register: ctrlWrapper(register),
   login: ctrlWrapper(login),
}