const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, message) => {
  const { data, error } = await resend.emails.send({
    from: "Hometown Hub <onboarding@resend.dev>",
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>${subject}</h2>
        <p>${message}</p>
      </div>
    `,
  });

  if (error) {
    console.error("RESEND ERROR:", error);
    throw new Error(error.message);
  }

  return data;
};

module.exports = sendEmail;