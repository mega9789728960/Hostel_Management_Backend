import pool from "../database/database.js";

async function removesession(req, res) {
  try {
    const { sessionid, userid, role } = req.body;

    if (!sessionid || !userid || !role) {
      return res.status(400).json({ error: "Please provide session id, user id, and role" });
    }

    const result = await pool.query(
      `DELETE FROM refreshtokens 
       WHERE id = $1 AND user_id = $2 AND role = $3`,
      [sessionid, userid, role]
    );

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
