const sendEmail = async (to, subject, message) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Coliving Platform",
          email: "kingnuman2611@gmail.com",
        },
        to: [{ email: to }],
        subject,
        htmlContent: `
          <div style="font-family: Arial, sans-serif;">
            <h2>${subject}</h2>
            <p>${message}</p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("BREVO ERROR:", data);
      throw new Error(data.message || "Brevo email failed");
    }

    console.log("Email sent:", data);
    return data;
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;