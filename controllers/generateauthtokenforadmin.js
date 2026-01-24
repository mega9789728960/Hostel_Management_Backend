import pool from "../database/database.js";
import jwt from "jsonwebtoken";

async function generateauthtokenforadmin(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await pool.query(
      "SELECT s.id, s.email FROM admins s JOIN refreshtokens r ON s.id = r.user_id WHERE r.tokens = $1;",
      [refreshToken]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Forbidden" });
    } else {
      const token = jwt.sign(
        { id: result.rows[0].id, email: result.rows[0].email, role: "admin" },
        process.env.SECRET_KEY || "secret",
        { expiresIn: "2h" }
      );

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });

      return res.json({ token });
    }
  } catch (err) {
    console.error("Error generating admin auth token:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default generateauthtokenforadmin;