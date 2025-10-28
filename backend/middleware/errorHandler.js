
export function errorHandler(err, req, res, next) {
  console.error(err); // For debugging - remove or log properly in production
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      details: err.details || null,
      status,
    }
  });
}
