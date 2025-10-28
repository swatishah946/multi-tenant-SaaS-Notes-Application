import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import tenantMw from "../middleware/tenant.middleware.js";
import auth from "../middleware/auth.middleware.js";
import { inviteUserValidator } from '../validators/userValidator.js';
import { validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/invite',
  inviteUserValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Validation error');
      err.status = 400;
      err.details = errors.array();
      return next(err);
    }

    // Only allow admins
    if (req.user.role !== 'Admin') {
      const err = new Error('Only admins can invite users');
      err.status = 403;
      return next(err);
    }

    try {
      const { email, role } = req.body;

      if (!email || !role || !["Admin", "Member"].includes(role)) {
        const err = new Error("Invalid email or role");
        err.status = 400;
        return next(err);
      }

      const existingUser = await User.findOne({
        email,
        tenantId: req.tenant._id,
      });
      if (existingUser) {
        const err = new Error("User already exists in tenant");
        err.status = 400;
        return next(err);
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
      // Centralized error handler used here!
      return next(error);
    }
  }
);

export default router;
