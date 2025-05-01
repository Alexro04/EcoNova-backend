function adminMiddleware(req, res, next) {
  const { role } = req.userInfo;

  //only admin users can pass this step
  if (role !== "admin")
    return res.status(400).json({
      success: false,
      message: "Only admin users can access this route",
    });

  next();
}

module.exports = adminMiddleware;
