const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: `"Co-Living Platform" <${process.env.EMAIL}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>${subject}</h2>

        <p>${message}</p>

        <br />

        <p>
          Regards,<br />
          Co-Living Space Platform
        </p>
      </div>
    `
  });
};

module.exports = sendEmail;