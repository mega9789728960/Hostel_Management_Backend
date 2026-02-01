import pool from "../database/database.js";
import redis from "../database/redis.js";

async function removesession(req, res) {
  try {
    let { sessionid, userid, role } = req.body;

    if (!sessionid || !userid || !role) {
      return res.status(400).json({ error: "Please provide session id, user id, and role" });
    }

    const result = await pool.query(
      `DELETE FROM refreshtokens 
       WHERE id = $1 AND user_id = $2 AND role = $3 RETURNING id, user_id, tokens, recent_authtoken_issued_time`,
      [sessionid, userid, role]
    );

    if (result.rowCount !== 0) {
      const { id, user_id, tokens, recent_authtoken_issued_time } = result.rows[0];

      // Fetch email to store in Redis
      let email;

      if (role === 'student') {
        const u = await pool.query('SELECT email FROM students WHERE id = $1', [userid]);
        if (u.rows.length) email = u.rows[0].email;
      } else if (role === 'admin') {
        const u = await pool.query('SELECT email FROM admins WHERE id = $1', [userid]);
        if (u.rows.length) email = u.rows[0].email;
      }

      if (email && recent_authtoken_issued_time) {
        const issuedTime = new Date(recent_authtoken_issued_time).getTime();
        const now = Date.now();
        const tokenLifeMinutes = parseInt(process.env.TOKENLIFE);
        // Check if recent_authtoken_issued_time + TOKENLIFE minutes >= now
        if (issuedTime + tokenLifeMinutes * 60 * 1000 >= now) {
          // Key: revoked_token:{id} (where id is refreshtokens table PK)
          // Value: JSON string with user info
          await redis.set(`revoked_token:${id}`, JSON.stringify({ user_id: userid, email, role }), { ex: tokenLifeMinutes * 60 });
        }
      }
    }

    if (result.rowCount === 0) {
      return res.status(200).json({
        message: "No such session found or not authorized"
      });
    }

    return res.status(200).json({
      message: "Session removed successfully"
    });

  } catch (err) {
    console.error("Remove session error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default removesession;
