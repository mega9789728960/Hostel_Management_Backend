import pool from "../../../database/database.js";

async function fetchcomplaintsforstudents(req, res) {
  let { id, token } = req.body;
  if (!id && req.user) {
    id = req.user.id;
  }

  try {
    const result = await pool.query(
      "SELECT * FROM complaints WHERE student_id = $1",
      [id]
    );

    console.log(result);

    return res.json({
      success: true,
      data: result.rows || [],
      token
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({ success: false, message: "Server error", token });
  }
}

export default fetchcomplaintsforstudents;
