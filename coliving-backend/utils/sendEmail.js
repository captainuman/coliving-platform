const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    await transporter.sendMail({
      from: `"HometownHub" <${process.env.EMAIL}>`,
      to,
      subject,
      html
    });

    console.log(`Email sent to ${to}`);

  } catch (error) {
    console.error(
      "EMAIL ERROR:",
      error.message
    );

    throw error;
  }
};

module.exports = sendEmail;