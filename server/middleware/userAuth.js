import jwt from 'jsonwebtoken'



const userAuth = async (req, res, next) => {

       const {token} = req.cookies

        if(!token){
            res.json({success: false, message: "no token"})
        }
    try {
        

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.id){
              if (!req.body) req.body = {};
            req.body.userId = tokenDecode.id
            // req.userId = tokenDecode.id; // ✅ Store userId safely here

        }else{
            res.json({success: false, message: "not authorized, login again"})
        }

        next()

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
        
    }


}

export default userAuth