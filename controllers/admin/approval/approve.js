import pool from "../../../database/database.js";

async function fetchstudent(req, res) {
  try {
    const body = req.body || {};
    const { token } = body;

    const { department, academic_year, status } = body;

    // ----- Mandatory Static Filters -----
    if (!department || !academic_year || status === undefined) {
      return res.status(400).json({
        success: false,
        message: "department, academic_year, and status are required"
      });
    }

    // ----- STATIC QUERY -----
    const query = `
      SELECT *
      FROM students
      WHERE department = $1
        AND academic_year = $2
        AND status = $3
      ORDER BY name ASC
    `;

    const values = [department, academic_year, status];

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: result.rows.length ? "Students fetched successfully" : "No students found",
      count: result.rows.length,
      students: result.rows,
      token
    });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
      token
    });
  }
}

export default fetchstudent;
