import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Tenant from "./models/tenant.model.js";
import User from "./models/user.model.js";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Tenant.deleteMany({});
await User.deleteMany({});
const tenants = await Tenant.insertMany([
  { name: "Acme", slug: "acme", plan: "free" },
  { name: "Globex", slug: "globex", plan: "free" }
]);
const adminPass = await bcrypt.hash("password", 10);
const userPass = await bcrypt.hash("password", 10);
const users = [
  { email: "admin@acme.test", password: adminPass, tenantId: tenants[0]._id, role: "Admin" },
  { email: "user@acme.test", password: userPass, tenantId: tenants[0]._id, role: "Member" },
  { email: "admin@globex.test", password: adminPass, tenantId: tenants[1]._id, role: "Admin" },
  { email: "user@globex.test", password: userPass, tenantId: tenants[1]._id, role: "Member" }
];
await User.insertMany(users);
console.log("Seeding done");
process.exit();
