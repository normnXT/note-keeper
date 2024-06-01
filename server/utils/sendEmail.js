const nodemailer = require('nodemailer');


const sendConfirmationEmail = (emailAddress, userID) => {

    const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const email = {
        from: 'Note Keeper',
        to: emailAddress,
        subject: 'Note Keeper | email confirmation',
        html: `
        Thank you! To finalise the registration process,
        <a href='${process.env.CLIENT_URL}/confirm/${userID}'>
          click here to confirm your email address.
        </a>
        If you didn't register to Note Keeper, you can safely ignore this email.
      `,
    };

    smtpTransport.sendMail(email, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent successfully!');
        }
        smtpTransport.close();
    });
};


const sendPasswordResetEmail = (emailAddress, userID) => {
    const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const email = {
        from: 'Note Keeper',
        to: emailAddress,
        subject: 'Note Keeper | password reset',
        html: `
        If it was you who requested this change,
        <a href='${process.env.CLIENT_URL}/passwordchange/${userID}'>
          click here to reset your password.
        </a>
        If you didn't request a password reset, you can ignore this email.
      `,
    };

    smtpTransport.sendMail(email, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent successfully!');
        }
        smtpTransport.close();
    });
};

module.exports = {sendConfirmationEmail, sendPasswordResetEmail};