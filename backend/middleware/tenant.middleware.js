import Tenant from "../models/tenant.model.js";
export default async function(req, res, next) {
  const tenantSlug = req.headers["x-tenant"];
  if (!tenantSlug) return res.status(400).json({ error: "Tenant slug required" });
  const tenant = await Tenant.findOne({ slug: tenantSlug });
  if (!tenant) return res.status(400).json({ error: "Invalid tenant" });
  req.tenant = tenant;
  next();
}
