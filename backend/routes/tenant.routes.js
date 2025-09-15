import express from "express";
import Tenant from "../models/tenant.model.js";
import auth from "../middleware/auth.middleware.js";
import tenantMw from "../middleware/tenant.middleware.js";
const router = express.Router();

router.post('/:slug/upgrade', tenantMw, auth(['Admin']), async (req, res) => {
  const updated = await Tenant.findOneAndUpdate(
    { slug: req.params.slug },
    { plan: "pro" },
    { new: true }
  );
  res.json({ message: "Subscription upgraded", plan: updated.plan });
});

export default router;
