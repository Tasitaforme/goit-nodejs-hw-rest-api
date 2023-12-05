//! via sendgrid
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY, SENDGRID_MAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

// const message = {
//   to: ["test@ukr.net", "test@i.ua", "test@gmail.com"],
//   from: "test@gmail.com",
//   subject: "From Node.js with love",
//   html: "<h1>Node.js is awesome platform</h1>",
//   text: "Node.js is awesome platform",
// };

// sgMail
//   .send(message)
//   .then(response => console.info(response))
//   .catch(error => console.error(error.response.body));

const sendEmail = async data => {
  const email = { ...data, from: SENDGRID_MAIL };
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;

//! via nodemailer
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const { META_PASSWORD, META_MAIL } = process.env;

// const nodemailerConfig = {
//   host: "smtp.meta.ua",
//   port: 465, //25, 465, 2525
//   secure: true,
//   auth: {
//     user: META_MAIL,
//     pass: META_PASSWORD,
//   },
// };

// const transport = nodemailer.createTransport(nodemailerConfig);

// // const email = {
// //   to: "kinedav149@huvacliq.com",
// //   from: "tasita@meta.ua",
// //   subject: "Test email",
// //   html: "<p><strong>Test email</strong> from localhost:3000</p>",
// // };

// // transport
// //   .sendMail(email)
// //   .then(() => console.log("Email send success"))
// //   .catch(error => console.log(error.message));

// const sendEmail = async data => {
//   const email = { ...data, from: META_MAIL };
//   await transport.sendMail(email);
//   return true;
// };

// module.exports = sendEmail;
