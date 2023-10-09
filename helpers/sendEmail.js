const { trusted } = require('mongoose');
const nodemailer = require('nodemailer')
require('dotenv').config()

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "salnikov.nkt@meta.ua",
    pass: META_PASSWORD
  }
};

const sendEmail = async (data) => {
  const email = { ...data, from: "salnikov.nkt@meta.ua" }
  await transport.sendMail(email)
}

const transport = nodemailer.createTransport(nodemailerConfig)

module.exports = sendEmail

// const email = {
//   to: "salnikov.nkt@gmail.com",
//   from: "salnikov.nkt@meta.ua",
//   subject: "Your Order #12345",
//   html: "<p>Hello, your order #12345 is ready for shipment. Please review the details and confirm.</p>"
// }

// transport.sendMail(email)
//   .then(() => console.log('good job'))
//   .catch(error => console.log(error.message))