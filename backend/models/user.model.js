import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Admin", "Member"] }
});
export default mongoose.model("User", userSchema);
