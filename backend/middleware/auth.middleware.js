import jwt from "jsonwebtoken";
export default (roles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send({ error: "Invalid token format" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (roles.length && !roles.includes(decoded.role)) return res.status(403).send({ error: "Forbidden" });
    next();
  } catch (err) {
    res.status(401).send({ error: "Invalid token" });
  }
};
