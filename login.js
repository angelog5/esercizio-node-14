app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ id: user.rows[0].id }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ message: "Logged in successfully", token });
});
