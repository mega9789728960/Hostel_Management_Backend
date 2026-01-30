import jwt from "jsonwebtoken";
import redis from "../database/redis.js";


async function studentauth(req, res, next) {
  // 1️⃣ Get tokens
  const token = req.body.token || req.query.token || req.headers["authorization"]?.split(" ")[1] || req.cookies.studentToken;
  if (!token) {
    return res.json({ message: 'No token provided' });
  }



  try {
    // 2️⃣ Verify access token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // 3️⃣ Verify if refresh token was revoked
    if (decoded.refreshtokenId) {
      const revokedData = await redis.get(`revoked_token:${decoded.refreshtokenId}`);
      if (revokedData) {
        const { user_id, email } = JSON.parse(revokedData);
        if (String(user_id) === String(decoded.id) && email === decoded.email) {
          return res.status(401).json({ message: "Token has been revoked (Logout)" });
        }
      }
    }

    if (decoded.role != "student") {
      return res.status(403).json({ "message": "you are not a student" }) // Status 403 for role mismatch
    }
    req.user = decoded;
    next();

  }
  catch (err) {
    console.error(err);
    res.status(401).json({
      message: err.message,
    });
  }
}

export default studentauth;
