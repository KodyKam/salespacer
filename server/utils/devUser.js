// server/utils/devUser.js
export const devUser = (req, res, next) => {
  req.user = {
    id: "dev-user-123"
  }

  next()
}