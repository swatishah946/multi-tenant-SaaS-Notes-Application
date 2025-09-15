import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import tenantMw from "../middleware/tenant.middleware.js";

const router = express.Router();

router.post("/login", tenantMw, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, tenantId: req.tenant._id });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role, tenantId: user.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );
    res.json({ token, role: user.role, tenant: req.tenant.slug });
  } catch (error) {
    console.error("Login route error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

