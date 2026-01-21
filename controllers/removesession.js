import pool from "../database/database.js";

async function removesession(req, res) {
  try {
    const { sessionid } = req.body;
    const userId = req.body.id; // from JWT middleware

    if (!sessionid) {
      return res.status(400).json({ error: "Please provide session id" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `DELETE FROM refreshtokens 
       WHERE id = $1 AND user_id = $2`,
      [sessionid, userId]
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
