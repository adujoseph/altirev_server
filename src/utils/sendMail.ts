const nodemailer = require('nodemailer');
export const sendEmail = (message: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'adujosephayo@gmail.com',
            pass: 'wuyq hrji nfbv dnib',
        },
    });
    const mailOptions = {
        from: 'iamjosephadu@gmail.com',
        to: 'Info@altirev.com',
        subject: 'I need my money interval',
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error while sending email:', error);
        }
        console.log('Email sent: ' + info.response);
    });
};
