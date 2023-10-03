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
  await User.findByIdAndUpdate(user._id, {token})
  res.json({
    token,
    user: {email, password}
  })

}

const current = async (req, res) => {
  const { email, subscription } = req.user;
  const user = await User.findOne({ email });
  res.json({
    email, subscription
    })
}

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(201).json({
    message: "Logout success"
  })
}

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.json(result)
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription)
}