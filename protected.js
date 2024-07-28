app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      message: "You have accessed a protected route!",
      user: req.user,
    });
  }
);
