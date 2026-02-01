import pool from "../database/database.js";
import jwt from "jsonwebtoken";

async function generateauthtokenforadmin(req, res) {
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
      res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" });
      res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
      return res.status(403).json({ message: "Forbidden: Invalid Refresh Token" });
    }

    const tokenData = tokenResult.rows[0];

    // 2. Check if the token belongs to an admin
    if (tokenData.role !== 'admin') {
      // Token exists but not for admin -> Don't clear cookies, just fail
      return res.status(403).json({ message: "Forbidden: Role Mismatch" });
    }

    // 3. Fetch admin data
    const result = await pool.query(
      "SELECT * FROM admins WHERE id = $1",
      [tokenData.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    } else {
      const user = result.rows[0];
      const { password, ...userData } = user;

      const token = jwt.sign(
        { id: user.id, email: user.email, role: "admin", refreshtokenId: tokenData.id },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });

      await pool.query(
        "UPDATE refreshtokens SET recent_authtoken_issued_time = NOW() WHERE id = $1",
        [tokenData.id]
      );

      return res.json({ token, data: userData });
    }
  } catch (err) {
    console.error("Error generating admin auth token:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default generateauthtokenforadmin;