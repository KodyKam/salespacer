// server/middleware/authMiddleware.js

export const protect = (req, res, next) => {
  // TEMP simple version (no JWT yet)
  req.user = { id: "mock-user-id" }
  next()
}