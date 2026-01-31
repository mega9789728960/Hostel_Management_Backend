import pool from "../../../database/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function adminLoginController(req, res) {
  try {
    const { email, password, deviceInfo } = req.body;
    console.log("Admin Login Request Body:", JSON.stringify(req.body, null, 2));

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    // Check if admin exists
    const result = await pool.query(
      "SELECT id, email, password FROM admins WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "No admin found with this email" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }

    // Generate tokens
    // Token generation moved below
    console.log(process.env.TOKENLIFE)

    // 1. Insert placeholder to get the generated ID
    const insertResult = await pool.query(
      `INSERT INTO refreshtokens (user_id, tokens, expires_at, role, device_info)
       VALUES ($1, 'PENDING', NOW() + interval '${process.env.REFRESH_TOKEN_LIFE[0]} days', 'admin', $2)
       RETURNING id`,
      [user.id, deviceInfo]
    );

    const tokenId = insertResult.rows[0].id;

    // Generate access token with refreshtokenId
    const token = jwt.sign(
      { id: user.id, email: user.email, role: "admin", refreshtokenId: tokenId },
      process.env.SECRET_KEY || "mysecret",
      { expiresIn: process.env.TOKENLIFE }
    );

    // 2. Generate refresh token with the tokenId
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: "admin", refreshtokenId: tokenId },
      process.env.SECRET_KEY || "mysecret",
      { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    );

    // 3. Update the row with the actual token
    await pool.query(
      "UPDATE refreshtokens SET tokens = $1 WHERE id = $2",
      [refreshToken, tokenId]
    );

    const maxAge = Number(process.env.REFRESH_TOKEN_LIFE[0]) * 24 * 60 * 60 * 1000;

    // Store in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: maxAge,
    });

    res.cookie("refreshTokenId", tokenId, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: maxAge,
    });

    const { password: password1, ...userData } = user;


    // ✅ No fetching students
    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      role: "admin",
      data: userData,
      refreshtokenId: tokenId,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

export default adminLoginController;
