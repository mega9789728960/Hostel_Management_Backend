import pool from "../../../database/database.js";

async function fetchstudent(req, res) {
  try {
    const {
      department,
      academic_year,
      status, // "all" | true | false
      page = 1,
      limit = 10
    } = req.body || {};

    if (!department || !academic_year || status === undefined) {
      return res.status(400).json({
        success: false,
        message: "department, academic_year, and status are required"
      });
    }

    const offset = (page - 1) * limit;

    const conditions = [];
    const values = [];
    let idx = 1;

    conditions.push(`department = $${idx++}`);
    values.push(department);

    conditions.push(`academic_year = $${idx++}`);
    values.push(academic_year);

    // ✅ apply status filter only if not "all"
    if (status !== "all") {
      conditions.push(`status = $${idx++}`);
      values.push(status === true || status === "true");
    }

    const query = `
      SELECT *
      FROM students
      WHERE ${conditions.join(" AND ")}
      ORDER BY name ASC
      LIMIT $${idx++} OFFSET $${idx}
    `;

    values.push(limit, offset);

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
