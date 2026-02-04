const apiError = require('../utils/apiError')

function createAuthService({userRepo, security, generator, nodemailer}){
    return{
        async register(data){
            const user = await userRepo.findByEmail(data.email)
            if(user){
                throw apiError(409, "DUPLICATE", "Email already exists",{expected: "Unique username",received: data.username}
                )
            }

            const expTime = generator.addMinutesToDate(new Date(), 5)
            const otp = generator.otp()
            const hashedPassword = await security.hashPassword(data.password)
            const newUser = await userRepo.create({
                ...data,
                otp,
                otpExpiredAt:expTime,
                password:hashedPassword
            })
            await nodemailer.sendEmail(data.email, "Email Activation", `Ini adalah otp anda ${otp}`)
            return {id:newUser.id, email:newUser.email, otp}
        },

        async login(email, password){
            const user = await userRepo.findByEmail(email)
            if(!user){
                throw apiError(404,"NOT_FOUND","User not found",{expected: "Registered username",received: username})
            }
            if(!user.verified){
                throw new apiError(403,"UNVERIFIED_ACCOUNT", 'Account need verification', 'Please check your email inbox for OTP verification')
            }

            const isMatch = await security.verifyPassword(password, user.password)
            if(!isMatch){
                throw apiError(401,"UNAUTHORIZED","Invalid credentials",{expected: "Valid username & password",received: "Invalid password"})
            }
            const token={
                id: user.id,
                email: user.email,
                role: user.role
            }

            const accessToken = security.generateAccessToken(token)
            return{
                accessToken,
                user:{
                    id: user.id,
                    email: user.email
                }
            }
        },
        
        async verify(email, otp){
            const existingUser = await userRepo.findByEmail(email)
            if(!existingUser){
                throw apiError(404, "NOT_FOUND", "User not found")
            }

            const isOtpValid = existingUser.otp === otp && existingUser.otpExpiredAt > new Date()
            if(!isOtpValid){
                throw apiError(409, "INVALID_OTP", "OTP Invalid or expired")
            }

            await userRepo.verify(existingUser.id)
            await nodemailer.sendEmail(email, "Email Verivication Success", `Selamat anda berhasil aktivasi`)
            return {
                id:existingUser.id,
                email:existingUser.email,
                verified:true
            }
        }
    }
}

module.exports = createAuthService