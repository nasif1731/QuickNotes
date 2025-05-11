import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  email: { type: String, unique: true },
  name: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default mongoose.model("User", UserSchema);