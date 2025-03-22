const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  console.log(email);
  console.log(token);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail/SMTP email
        pass: process.env.EMAIL_PASS, // Your email password or App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<h2>Click the link below to verify your email:</h2>
                   <a href="${process.env.CLIENT_URL}/verify/${token}">Verify Email</a> <p> The link will be expired in 1 hour.</p> <p> You can verify the link after Login. No worries.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendVerificationEmail;
