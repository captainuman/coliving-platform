const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, message) => {
  await apiInstance.sendTransacEmail({
    sender: {
      email: "yourverifiedemail@gmail.com",
      name: "Hometown Hub",
    },
    to: [{ email: to }],
    subject,
    htmlContent: `<p>${message}</p>`,
  });
};

module.exports = sendEmail;