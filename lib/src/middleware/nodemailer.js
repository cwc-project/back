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
    throw new Error('Message should have "To" and "Html" fileds inclued');
  }
}

module.exports = new Nodemailer();
