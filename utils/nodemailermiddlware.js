const nodemailer = require("nodemailer");

const sendingMail = async(req,resizeBy,next) =>{
const transporter = nodemailer.createTransport ({
  service: "gmail", // or "SendGrid", "Mailgun", etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: '"Your App" <yourapp@example.com>',
  to: email,
  subject: "Reset Your Password",
  html: `<p>You requested to reset your password.</p>
         <p>Click the link below to reset it:</p>
         <p>This link expires in 1 hour.</p>`,
};

await transporter.sendMail(mailOptions);

}