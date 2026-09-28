import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Connection failed:", error.message);
    process.exit(1);     // agar DB connect na ho, server start hi na ho — crash better hai silent fail se
  }
};

export default connectDB;