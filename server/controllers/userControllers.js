import userModel from "../models/userModel.js";


export const getUserData = async (req, res) => {

    try {
        
        const {userId} = req.body
        
        const user = await userModel.findById(userId)

        if(!user){
            res.json({success: false, message: "user not found"})
        }

        res.json({success: true, 
            userData: {
                name : user.name,
                isAccountVerified : user.isAccountVerified
            }
        })

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
        
    }

}