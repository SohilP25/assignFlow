import nodemailer from "nodemailer";

export default function sendMail(recipientsArray) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    },
  });

  for (let recipient of recipientsArray) {
    var mailOptions = {
      from: "Assignment Assigned",
      to: recipient.email,
      subject: "Assignment Update!",
      text: "New Assignment is assigned!! Check Due date before expires",
    };
    console.log(recipient);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent to : " + recipient.email + info.response);
      }
    });
  }
}
