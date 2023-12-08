var nodemailer = require('nodemailer');
const USER = process.env.USER;
const PASS = process.env.PASS;
const appName = process.env.APP_NAME;

const sendAccVerificationEmail = async (email, link) => {
  const htmlText = `
  <html>
    <head>
      <style>
        /* Add some CSS styles here if needed */
      </style>
    </head>
    <body>
      <h3>Welcome to the ${appName} </h3>
      <p>Thank you for registering an account with us.</p>
      <p>Please click the following link to verify your email:</p>
      <a href="${link}">Verify Email</a>
      <p>If you did not register an account with us, please disregard this email.</p>
      <p>Thank you,</p>
     
    </body>
  </html>
`;
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER,
      pass: PASS
    }
  });

  var mailOptions = {
    from: USER,
    to: email,
    subject: "Account verification",
    html: htmlText
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

const resetPasswordEmail = async (email, resetPasswordEmailLink) => {
  const htmlText = `
    <html>
      <head>
        <style>
          /* Add some CSS styles here if needed */
        </style>
      </head>
      <body>
        <h3>Reset Your Password - ${appName}</h3>
        <p>We have received a request to reset your password for your account.</p>
        <p>Please click the following link to reset your password:</p>
        <a href="${resetPasswordEmailLink}">Reset Password</a>
        <p>If you did not request a password reset, please disregard this email.</p>
        <p>Thank you,</p>
      </body>
    </html>
  `;
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER,
      pass: PASS
    }
  });

  var mailOptions = {
    from: USER,
    to: email,
    subject: "Reset password request Confirmation",
    html: htmlText
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

module.exports = { sendAccVerificationEmail, resetPasswordEmail };