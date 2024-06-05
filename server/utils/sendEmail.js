const nodemailer = require('nodemailer');


const sendThankYouEmail = (emailAddress, displayName) => {

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
        subject: 'Note Keeper | Thank you!',
        html: `
        <p>Thank you for successfully registering to Note Keeper ${displayName}!</p>
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
        subject: 'Note Keeper | Password reset',
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
            console.log('Email sent successfully!');
        }
        smtpTransport.close();
    });
};

module.exports = {sendThankYouEmail, sendPasswordResetEmail};