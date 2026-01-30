import jwt from "jsonwebtoken";
import pool from "../../../database/database.js";
import redis from "../../../database/redis.js";

async function logout(req, res) {
  try {
    // 1️⃣ Get refresh token from cookies
    const refreshToken = req.cookies?.refreshToken;
    const accessToken = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (accessToken) {
      await redis.set(`blacklist:${accessToken}`, 'true', { ex: 120 });
    }

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token missing" });
    }

    // 2️⃣ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
    }


    // 3️⃣ Delete refresh token from DB and return deleted ID(s)
    const result = await pool.query(
      `DELETE FROM refreshtokens WHERE user_id = $1 AND tokens = $2 RETURNING id`,
      [decoded.id, refreshToken]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "No refresh token found to delete" });
    }

    // 4️⃣ Clear the refresh token cookie on client
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    // Clear accessToken as well
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // 5️⃣ Send success response
    return res.json({
      success: true,
      message: "Logged out successfully",
      deletedTokenIds: result.rows.map(row => row.id),
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export default logout;
