const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Co-Living Platform" <${process.env.EMAIL}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>${subject}</h2>
        <p>${message}</p>
      </div>
    `,
  });
};

module.exports = sendEmail;