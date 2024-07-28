const express = require("express");
const multer = require("multer");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({});

const upload = multer({
  dest: "uploads/",
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image file."), false);
    }
  },
});

app.post("/planets/:id/image", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const filePath = req.file ? req.file.path : null;

  if (!filePath) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const result = await pool.query(
      "UPDATE planets SET image = $2 WHERE id = $1 RETURNING *",
      [id, filePath]
    );
    const updatedPlanet = result.rows[0];

    if (updatedPlanet) {
      res.json({ success: true, planet: updatedPlanet });
    } else {
      res.status(404).send("Planet not found.");
    }
  } catch (err) {
    res.status(500).send("Server error.");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
