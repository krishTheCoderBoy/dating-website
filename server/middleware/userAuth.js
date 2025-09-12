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






// import jwt from "jsonwebtoken";
// import userModel from "../models/userModels.js";

// const userAuth = async (req, res, next) => {
//   try {
//     const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

//     if (!token) {
//       return res.status(401).json({ success: false, error: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await userModel.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, error: "Unauthorized" });
//   }
// };

// export default userAuth;
