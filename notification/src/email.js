require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({ // actulally email ko send kart ahe transporter 
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});
// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    // console.log('Message sent: %s', info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};



// sendEmail('cyberrebel79@gmail.com',   'Test Subject', 'Test text', '<h1>Test HTML</h1>');


module.exports = { sendEmail };
// for test ko cd src cd email and node email.js 
//sendEmail('ganeshtathe920@gmail.com', 'Test Subject', 'Test text', '<h1>Test HTML</h1>');
 