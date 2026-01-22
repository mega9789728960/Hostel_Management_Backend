import pool from "../../../database/database.js";

async function fetchstudent(req, res) {
  try {
    const body = req.body || {};

    const {
      department,
      academic_year,
      status,
      page = 1,
      limit = 10
    } = body;

    if (!department || !academic_year || status === undefined) {
      return res.status(400).json({
        success: false,
        message: "department, academic_year, and status are required"
      });
    }

    const offset = (page - 1) * limit;

    const query = `
      SELECT *
      FROM students
      WHERE department = $1
        AND academic_year = $2
        AND status = $3
      ORDER BY name ASC
      LIMIT $4 OFFSET $5
    `;

    const values = [department, academic_year, status, limit, offset];
    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      page,
      limit,
      fetched: result.rows.length,
      hasMore: result.rows.length === limit,
      students: result.rows
    });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}

export default fetchstudent;
