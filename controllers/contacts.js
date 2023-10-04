const {Contact} = require('../models/contact')
const {HttpError} = require('../helpers')
const ctrlWrapper = require('../helpers/ctrlWrapper')


const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;
  let result;

  if (favorite === 'true') { 
    result = await Contact.find({ owner, favorite: true }, 'name phone email favorite', { skip, limit }).populate("owner", 'name phone');
  } else {
    result = await Contact.find({ owner }, 'name phone email favorite', { skip, limit }).populate("owner", 'name phone');
  }

  res.json(result);
}

const getById = async (req, res, next) => {
  const { contactId } = req.params
    const result = await Contact.findById(contactId)
    if (!result) throw HttpError(404, "Not found")
    res.json(result)
}

const addContact = async (req, res, next) => {
    const {_id: owner} = req.user
    const result = await Contact.create({...req.body, owner})
    res.status(201).json({message: "Create contact success"})
}

const deleteContact = async (req, res, next) => {
      const { contactId } = req.params
      const result = await Contact.findByIdAndDelete(contactId)
      if (!result) throw HttpError(404, "Not found")
      res.json({message: "Delete success"})
}

const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
    if (!result) throw HttpError(404, "Not found")
    res.json(result)
}

const updateFavorite = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
    if (!result) throw HttpError(404, "Not found")
    res.json(result)
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite)
}