const nodemailer = require("nodemailer");
const env = require("../config/env");

// transporter -> an object responsible for connecting to SMTP server
const transporter = nodemailer.createTransport({
  host: env.MAILTRAP_HOST,
  port: Number(env.MAILTRAP_PORT),
  auth: {
    user: env.MAILTRAP_USER,
    pass: env.MAILTRAP_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: env.MAIL_FROM,
    to: to,
    subject: subject,
    html: html,
  });
};

module.exports = sendMail;
