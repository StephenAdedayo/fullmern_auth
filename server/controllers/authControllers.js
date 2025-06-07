import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";



export const register = async (req, res) => {


    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.json({success : false, message : "Please provide the required credentials"})
    }

    try {
        
        const existerUser = await userModel.findOne({email})
        if(existerUser){
            res.json({success : false, message : "user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({
            name, 
            email,
            password : hashedPassword
        })

        await user.save()

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : "7d"})

        res.cookie("token", token, {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        // sending welcome emails
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : "Welcome to developer",
            text : `Welcome to developer, your account has been created with email id: ${email} `
        }

        await transporter.sendMail(mailOptions)

                return res.json({success: true})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message : error.message})
        
    }


}

export const login = async (req, res) => {

 const {email, password} = req.body

    if(!email || !password){
        res.json({success : false, message : "Please provide the required fields"})
    }

    try {

        const user = await userModel.findOne({email})

        if(!user){
            res.json({success : false, message: 'user does not exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            res.json({success: false, message : "password does not match"})
        }

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : "7d"})

        res.cookie("token", token, {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success: true})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message : error.message})
        
    }


}

export const logout = async (req, res) => {

    try {
        
        res.clearCookie("token", {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        res.json({success: true, message : 'user logged out'})

    } catch (error) {
        console.log(error.message);
        res.json({success : false, message : error.message})
        
    }

}


export const sendVeriftyOtp = async (req, res) => {

    try {

        const {userId} = req.body

        const user = await userModel.findById(userId)

        if(user.isAccountVerified){
            res.json({success:false, message : "account already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : "Account Verification Otp",
            // text : `Your otp is ${otp}. verify your account using this OTP`,
            html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }


        await transporter.sendMail(mailOptions)

        res.json({success: true, message : "Verification otp sent to your email"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message : error.message})
        
    }

}


export const verifyEmail = async (req, res) => {

    const {userId, otp} = req.body

    if(!userId || !otp){
        res.json({success :false, message: "please provide otp"})
    }

    try {

        const user = await userModel.findById(userId)

        if(!user){
            res.json({success: false, message : "user not found"})
        }

        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            res.json({success : false, message : 'invalid otp'})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            res.json({success: false, message : "otp has already expired"})
        }

        user.isAccountVerified = true

        user.verifyOtp = ""
        user.verifyOtpExpireAt = 0

        await user.save()


        res.json({success: true, message : "email verified successfully"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
        
    }

}


export const isAuthenticated = (req, res) => {

    try {
        res.json({success: true})
    } catch (error) {
        res.json({success: false, message :error.message})
    }

}


export const sendResetOtp = async (req, res)  => {

      const {email} = req.body

      if(!email){
        res.json({success: false, message : "email is required"})
      }

      try {

        const user = await userModel.findOne({email})

        if(!user){
            res.json({success : false, message : "user not found"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : "Reset password Otp",
            // text : `Your otp to reset your password is ${otp}. please proceed with this otp to reset your password`
            html : PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }


        await transporter.sendMail(mailOptions)
        
        res.json({success: true, message: "reset otp sent to your email successfully"})
      } catch (error) {
        console.log(error.message);
        res.json({success : false, message : error.message})
        
      }

}

export const resetPassword = async (req, res) => {


    const {email, otp, newPassword} = req.body

    if(!email || !otp || !newPassword){
        res.json({success : false, message : "these fields are required"})
    }

    try {
        
        const user = await userModel.findOne({email})

        if(!user){
            res.json({success: false, message : "user not found"})
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            res.json({success: false, message: "invalid otp"})
        }

        if(user.resetOtpExpireAt < Date.now()){
            res.json({success: false, message : "otp has expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        user.resetOtp = "" 
        user.resetOtpExpireAt = 0

        await user.save()

        res.json({success: true, message : "password reset successful"})

    } catch (error) {
        console.log(error.message);
        res.json({success : false, message : error.message})
        
    }


}