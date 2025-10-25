// config/mongodb.js
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("\nMongoDB Connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
