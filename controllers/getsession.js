import pool from "../database/database.js";

async function getsession(req, res) {
  try {
    const id = req.body.id; // assuming JWT middleware

    if (!id) {
      return res.status(400).json({ error: "Provide a valid user ID" });
    }

    const result = await pool.query(
      "SELECT * FROM refreshtokens WHERE user_id = $1",
      [id]
    );

    return res.status(200).json({ data: result.rows });

  } catch (err) {
    console.error("Get session error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default getsession;
