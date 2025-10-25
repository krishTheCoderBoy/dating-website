import jwt from "jsonwebtoken";


const userAuth = async (req, res, next) => {
  try {
    console.log("\n\nthis is the userAuth middleware : src/middlewares/userAuth.js");
    // --- Extract token from Authorization header ---
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: No token provided or invalid format",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    console.log("👉 Extracted token:", token);

    // --- Verify token ---
    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);

    if (!decoded.id) {
      console.log("❌ No ID found in decoded token!");
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid token payload",
      });
    }
    console.log("✅ User ID from token:", decoded.id);

    // --- Attach user ID to request ---
    req.userId = decoded.id;

    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
export default userAuth;