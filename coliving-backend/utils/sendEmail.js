const nodemailer = require("nodemailer");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const sendEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: "74.125.200.108",
    port: 587,
    secure: false,
    requireTLS: true,
    tls: {
      servername: "smtp.gmail.com",
    },
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Co-Living Platform" <${process.env.EMAIL}>`,
    to,
    subject,
    html: `<p>${message}</p>`,
  });
};

module.exports = sendEmail;