import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
        return res.status(401).json({ success: false, error: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ success: false, error: "Invalid token" });
    }
}
