import express from "express";
import Note from "../models/note.model.js";
import Tenant from "../models/tenant.model.js";
import auth from "../middleware/auth.middleware.js";
import tenantMw from "../middleware/tenant.middleware.js";

const router = express.Router();
router.use(tenantMw);
router.use(auth(["Admin", "Member"]));

// CREATE
router.post('/', async (req, res) => {
  const tenant = await Tenant.findById(req.user.tenantId);
  
  // Role restriction: Only Admin and Member can add notes
  if (!['Admin', 'Member'].includes(req.user.role)) {
    return res.status(403).json({ error: "Not authorized to add notes" });
  }

  // Subscription gating: Free plan max 3 notes
  if (tenant.plan === 'free') {
    const count = await Note.countDocuments({ tenantId: tenant._id });
    if (count >= 3) {
      return res.status(403).json({ error: 'Free plan limit reached, upgrade to Pro to add more notes' });
    }
  }

  const note = await Note.create({
    tenantId: req.user.tenantId,
    userId: req.user.userId,
    content: req.body.content,
  });

  res.json(note);
});

// READ ALL
router.get("/", async (req, res) => {
  const notes = await Note.find({ tenantId: req.user.tenantId });
  res.json(notes);
});

// READ ONE
router.get("/:id", async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.user.tenantId },
    { content: req.body.content },
    { new: true }
  );
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, tenantId: req.user.tenantId });
  res.json({ success: true });
});

export default router;
