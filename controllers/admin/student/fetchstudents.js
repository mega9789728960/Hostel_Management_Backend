import pool from "../../../database/database.js";

async function fetchstudent(req, res) {
  try {
    const {
      department,
      academic_year,
      status, // "all" | true | false
      page = 1,
      limit = 10,
      id // Optional: fetch specific student
    } = req.body || {};

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    const conditions = [];
    const values = [];
    let idx = 1;

    // Optional: Fetch specific student by ID
    if (id) {
      conditions.push(`id = $${idx++}`);
      values.push(id);
    }

    // Optional: Filter by department if provided
    if (department) {
      conditions.push(`department = $${idx++}`);
      values.push(department);
    }

    // Optional: Filter by academic_year if provided
    if (academic_year) {
      conditions.push(`academic_year = $${idx++}`);
      values.push(academic_year);
    }

    // Optional: Filter by status if provided and not "all"
    if (status !== undefined && status !== null && status !== "all") {
      conditions.push(`status = $${idx++}`);
      values.push(status === true || status === "true");
    }

    // Construct the WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT *
      FROM students
      ${whereClause}
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
