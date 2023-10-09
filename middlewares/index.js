const validateBody = require('./validateBody')
const isValidId = require('./isValidId')
const authenticate = require('./authenticate')
const uploads = require('./uploads')
const resize = require('./resizeAvatar')

module.exports = {
  validateBody,
  isValidId,
  authenticate,
  uploads,
  resize,
}