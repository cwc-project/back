const nodemailer = require('nodemailer');

class Nodemailer {
  constructor() {
    this.config = `smtps://${process.env.EMAIL}:${process.env.EMAIL_PASS}@smtp.mail.ru/?pool=true`;
  }

  transporter() {
    return nodemailer.createTransport(this.config, {
      from: `CWC-project <${process.env.EMAIL}>`,
    });
  }

  send(message) {
    if (message.to && message.html) {
      return this.transporter().sendMail(message, (err, info) => {
        if (err) return err;
        return `Email sent: , ${info}`;
      });
    }
    const err = 'Message should have "To" and "Html" fileds inclued';
    throw err;
  }
}

module.exports = new Nodemailer();

// static testConnection() {
//   this.transporter().verify((error, success) => {
//     error
//       ? console.log(error)
//       : console.log('Server is ready to take our messages: ', success);
//   });
// }
