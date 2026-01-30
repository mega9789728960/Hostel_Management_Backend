import jwt from "jsonwebtoken";
import redis from "../database/redis.js";

async function authorisation(req, res, next) {
  // 1️⃣ Get tokens
  const token = req.body.token || req.query.token || req.headers["authorization"]?.split(" ")[1] || req.cookies.accessToken;
  if (!token) {
    return res.json({ message: 'No token provided' });
  }

  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is invalidated" });
  }

  try {
    // 2️⃣ Verify access token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role != "admin") {
      return res.json({ "message": "you are not a student" })
    }

    next();

  }
  catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
}

export default authorisation;
