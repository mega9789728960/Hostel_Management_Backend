import pool from "../database/database.js";

async function getsession(req, res) {
  try {
    let { userid, role } = req.body;

    if (req.user) {
      userid = req.user.id;
      role = req.user.role;
    }

    if (!userid || !role) {
      return res.status(400).json({ error: "Provide a valid user ID and role" });
    }

    const result = await pool.query(
      "SELECT * FROM refreshtokens WHERE user_id = $1 AND role = $2",
      [userid, role]
    );

    return res.status(200).json({ data: result.rows });

  } catch (err) {
    console.error("Get session error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default getsession;
