// server.js
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/mongodb.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => { console.log(`\n✅ Unified Server running on port ${PORT}`); });
    } catch (error) {
        console.error("failed to start server");
        process.exit(1);
    }
};
startServer();