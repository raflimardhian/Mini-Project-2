const crypto = require("crypto");

const generator = {
    otp: () => {
        const digit = "0123456789";
        let otp = "";

        for (let i = 0; i < 6; i++) {
        otp += digit[Math.floor(Math.random() * 10)];
        }

        return otp;
    },

    resetToken: () => {
        return crypto.randomBytes(20).toString("hex");
    },

    addMinutesToDate: (date, minutes)=>{
        return new Date(date.getTime() + minutes * 60000)
    }
};

module.exports = generator;