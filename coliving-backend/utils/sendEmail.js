const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, message) => {
  try {
    console.log("EMAIL:", process.env.EMAIL ? "exists" : "missing");
    console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "exists" : "missing");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
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
  } catch (error) {
    console.error("EMAIL SEND ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;