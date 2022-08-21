export const adminOnly = async (req, res, next) => {
  if (req.user.username !== "admin") {
    res.json("Error: Not the admin");
  } else {
    next();
  }
}
