import pool from "../../../database/database.js";

async function showattendance(req, res) {
  try {
    const {
      token,
      // Optional Filters
      registration_number,
      department,
      academic_year,
      date,
      status,
      // Pagination (Optional)
      page = 1,
      limit = 10
    } = req.body || {};

    // Calculate offset
    const offset = (page - 1) * limit;

    // Base clauses
    const joinConditions = ["a.student_id = s.id"];
    const whereConditions = [];
    let paramIndex = 1;
    const values = [];

    // 1. Build values and conditions for the main data query

    // Note: We need to handle parameters carefully. 
    // We'll rebuild the query parts to ensure parameter indices are correct.

    // Date condition for JOIN
    if (date && date.trim() !== "") {
      joinConditions.push(`a.date = $${paramIndex++}`);
      values.push(new Date(date).toISOString().split("T")[0]);
    }

    // Status condition for JOIN
    if (status && status.trim() !== "" && status !== "all") {
      joinConditions.push(`a.status = $${paramIndex++}`);
      values.push(status);
    }

    // Department condition
    if (department && department.trim() !== "") {
      whereConditions.push(`s.department = $${paramIndex++}`);
      values.push(department);
    }

    // Academic Year condition
    if (academic_year && academic_year.trim() !== "") {
      whereConditions.push(`s.academic_year = $${paramIndex++}`);
      values.push(academic_year);
    }

    // Registration Number condition
    if (registration_number && registration_number.trim() !== "") {
      whereConditions.push(`s.registration_number = $${paramIndex++}`);
      values.push(registration_number);
    }

    // Construct the JOIN and WHERE strings
    const joinClause = `LEFT JOIN attendance a ON ${joinConditions.join(" AND ")}`;
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // --- COUNT QUERY ---
    // We need a separate count query using essentially the same conditions
    // to tell the frontend the total number of matching records.
    const countQuery = `
      SELECT COUNT(*) 
      FROM students s
      ${joinClause}
      ${whereClause}
    `;

    // --- DATA QUERY ---
    const dataQuery = `
      SELECT 
        s.id AS student_id,
        s.name,
        s.department,
        s.academic_year,
        s.registration_number,
        s.roll_number,
        s.room_number,
        s.email,
        s.approved_by,
        s.created_at AS student_created_at,
        s.updated_at AS student_updated_at,
        s.deleted_at AS student_deleted_at,
        a.id AS attendance_id,
        a.date AS attendance_date,
        a.status AS attendance_status,
        a.created_at AS attendance_created_at,
        a.updated_at AS attendance_updated_at
      FROM students s
      ${joinClause}
      ${whereClause}
      ORDER BY s.name
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    // Add limit and offset to values
    const queryValues = [...values, limit, offset];

    // Execute queries
    // We can run them in parallel for performance
    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, values),
      pool.query(dataQuery, queryValues)
    ]);

    const totalRecords = parseInt(countResult.rows[0].count, 10);
    const rows = dataResult.rows;

    // 📤 Send response
    return res.json({
      success: true,
      data: rows,
      token,
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      message: rows.length === 0 ? "No attendance records found" : undefined,
    });

  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    return res.status(500).json({ success: false, error: "Server error", token: req.body?.token });
  }
}

export default showattendance;
