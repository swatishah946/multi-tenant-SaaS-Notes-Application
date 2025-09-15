import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import tenantMw from "../middleware/tenant.middleware.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/users/invite — Admin-only invites a new user
router.post("/invite", tenantMw, auth(["Admin"]), async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role || !["Admin", "Member"].includes(role)) {
      return res.status(400).json({ error: "Invalid email or role" });
    }

    const existingUser = await User.findOne({
      email,
      tenantId: req.tenant._id,
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists in tenant" });
    }

    const hashedPassword = await bcrypt.hash("password", 10);

    const newUser = await User.create({
      email,
      role,
      tenantId: req.tenant._id,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User invited successfully. Default password is 'password'.",
      user: { email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error inviting user" });
  }
});

export default router;
