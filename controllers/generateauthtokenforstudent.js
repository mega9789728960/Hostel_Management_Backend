import pool from "../database/database.js";
import jwt from "jsonwebtoken";

async function generateauthtoken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // 1. First check if token exists in refreshtokens table
    const tokenResult = await pool.query(
      "SELECT * FROM refreshtokens WHERE tokens = $1",
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      // Token not in DB -> Logout sequence (Clear cookies)
      res.clearCookie("studentToken", { httpOnly: true, secure: true, sameSite: "none" });
      res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
      return res.status(403).json({ message: "Forbidden: Invalid Refresh Token" });
    }

    const tokenData = tokenResult.rows[0];

    // 2. Check if the token belongs to a student
    if (tokenData.role !== 'student') {
      // Token exists but not for student (could be admin) -> Don't clear cookies, just fail
      return res.status(403).json({ message: "Forbidden: Role Mismatch" });
    }

    // 3. Fetch student data
    const result = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [tokenData.user_id]
    );
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
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