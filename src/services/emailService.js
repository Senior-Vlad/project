const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendWeatherEmail(to, subject, text) {
  const msg = { to, from: process.env.EMAIL_SENDER, subject, text };
  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error.response?.body || error);
    throw error;
  }
}

module.exports = { sendWeatherEmail };
