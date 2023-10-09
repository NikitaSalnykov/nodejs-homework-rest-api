const { User } = require('../models/user')
const {HttpError} = require('../helpers')
const ctrlWrapper = require('../helpers/ctrlWrapper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const gravatar = require('gravatar')
const path = require('path')
const fs = require('fs/promises')
const Jimp = require("jimp");

const { SECRET_KEY } = process.env

const avatarsDir = path.join(__dirname, '../', "public", "avatars")

const register = async (req, res) => {
  const { email, password} = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use")
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({...req.body, password: hashPassword, avatarURL})

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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (req.file === undefined) throw HttpError(400, 'Please select a file to upload');
  const { path: tempUpload, originalname } = req.file
  const filename =  `${_id}_${originalname}`
  const resultUpload = path.join(avatarsDir, filename)
  await fs.rename(tempUpload, resultUpload)
  const avatarURL = path.join('avatars', filename)
  await User.findByIdAndUpdate(_id, { avatarURL })

  
  res.status(200).json({
    avatarURL
  })
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar)
}