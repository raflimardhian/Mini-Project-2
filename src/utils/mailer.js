require("dotenv").config();
const nodemailer = require("nodemailer");

const {USER, PASS} = process.env

module.exports = {
  sendEmail: async (to, subject, text) => {
    try{
        const transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
            user: USER,
            pass: PASS,
            },
        });

        const mailOptions = {
            from: USER,
            to,
            subject,
            text,
        };

        await new Promise((resolve, reject) => {
            transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
            });
        });
        } catch(error){
            console.log(error);
        }
    }
};
