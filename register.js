app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    [username, hashedPassword]
  );

  res.status(201).json(newUser.rows[0]);
});
