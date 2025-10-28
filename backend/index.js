import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import healthRoutes from "./routes/health.routes.js";
import usersRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";


dotenv.config();

const app = express();

const allowedOrigins = [
  "https://multi-tenant-saas-frontend.vercel.app",  
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  allowedHeaders: ["Content-Type", "Authorization", "x-tenant"],
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/health", healthRoutes);
app.use("/api/users", usersRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
