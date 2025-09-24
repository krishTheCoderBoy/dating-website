import jwt from "jsonwebtoken";


const userAuth = async(req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({success: false, error: "Unauthorized: No token provided"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.id){
            req.body.userId = decoded.id;

        }else{
            return res.status(401).json({success: false, error: "Unauthorized: Invalid token"});
        }
        next();
    }
    catch(err){
        return res.status(500).json({success: false, error: "Internal Server Error"});
    }
}
export default userAuth;






