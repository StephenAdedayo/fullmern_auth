import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"



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