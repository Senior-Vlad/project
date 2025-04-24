const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendAlert = async (email, message) => {
  await transporter.sendMail({
    from: '"Weather Alerts" <alerts@example.com>',
    to: email,
    subject: "Weather alert",
    text: message
  });
};