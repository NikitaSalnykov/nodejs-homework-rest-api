const Jimp = require('jimp');
const {HttpError} = require('../helpers/')

async function resizeAvatar(req, res, next) {
  try {
    if (req.file === undefined) {
     throw HttpError(400, 'Please select a file to upload')
    }

    const { path: tempUpload } = req.file;
    const lenna = await Jimp.read(tempUpload);
    await lenna.resize(256, 256).writeAsync(tempUpload);

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = resizeAvatar;