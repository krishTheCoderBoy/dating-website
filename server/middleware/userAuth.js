import jwt from "jsonwebtoken";


const userAuth = async(req, res, next) => {
    const {token} = req.cookies;
    console.log("👉 Cookies received:", req.cookies); // ✅ Check if token exists in cookies
  console.log("👉 Extracted token:", token);

    if(!token){
        return res.status(401).json({success: false, error: "Unauthorized: No token provided"});
    }

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);

    if (decoded.id) {
      req.body.userId = decoded.id;
      console.log("✅ User ID from token:", decoded.id);
    } else {
      console.log("❌ No ID found in decoded token!");
      return res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });
    }
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
export default userAuth;






