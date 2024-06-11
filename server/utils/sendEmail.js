const nodemailer = require("nodemailer");

const sendThankYouEmail = (emailAddress, displayName) => {
    const smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.APP_PASSWORD}`,
        },
    });

    const email = {
        from: "Note Keeper",
        to: emailAddress,
        subject: "Note Keeper | Thank you!",
        html: `
        <p>${displayName}, thank you for registering to Note Keeper!</p>
      `,
    };

    smtpTransport.sendMail(email, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent successfully!");
        }
        smtpTransport.close();
    });
};

const sendPasswordResetEmail = (emailAddress, userID) => {
    const smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.APP_PASSWORD}`,
        },
    });

    const email = {
        from: "Note Keeper",
        to: emailAddress,
        subject: "Note Keeper | Password reset",
        html: `
        If it was you who requested this change,
        <a href='${process.env.CLIENT_URL}/resetpassword/${userID}'> 
          click here to reset your password.
        </a>
        If you didn't request a password reset, you can ignore this email.
      `,
    };

    smtpTransport.sendMail(email, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent successfully!");
        }
        smtpTransport.close();
    });
};

module.exports = { sendThankYouEmail, sendPasswordResetEmail };
