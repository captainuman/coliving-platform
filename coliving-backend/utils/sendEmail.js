const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, message) => {
  try {
    const result = await apiInstance.sendTransacEmail({
      sender: {
        name: "Coliving-Platform",
        email: "kingnuman2611@gmail.com"
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: `
        <div style="font-family: Arial, sans-serif;">
          <h2>${subject}</h2>
          <p>${message}</p>
        </div>
      `,
    });

    console.log("Email sent:", result);
  } catch (error) {
    console.error("BREVO ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;