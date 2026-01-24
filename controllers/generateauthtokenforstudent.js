import pool from "../database/database.js";
import jwt from "jsonwebtoken";

async function generateauthtoken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await pool.query(
      "SELECT s.* FROM students s JOIN refreshtokens r ON s.id = r.user_id WHERE r.tokens = $1;",
      [refreshToken]
    );
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(403).json({ message: "Forbidden" });
    } else {
      const user = rows[0];
      const { password, ...userData } = user;

      const token = jwt.sign(
        { id: user.id, email: user.email, role: "student" },
        process.env.SECRET_KEY || "secret",
        { expiresIn: "2h" }
      );

      res.cookie("studentToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });

      return res.json({ token, data: userData });
    }
  } catch (err) {
    console.error("Error generating auth token:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default generateauthtoken;