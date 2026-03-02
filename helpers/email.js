const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config();

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: { api_key: process.env.SENDGRID_API_KEY }
  })
);

exports.sendEmail = ({ to, subject, html }) => {
  return transporter.sendMail({ to, from: 'khushali.trivedi@seaflux.tech', subject, html });
};
