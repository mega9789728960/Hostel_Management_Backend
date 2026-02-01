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
      // Date Range Filters
      from_date,
      to_date,
      specific_date,
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

    // --- CHECK IF THIS IS A SPECIFIC STUDENT REQUEST ---
    const isStudentRequest = registration_number && registration_number.trim() !== "";

    if (isStudentRequest) {
      // Mandate Date Filters for Student Request
      if (!specific_date && (!from_date || !to_date)) {
        return res.status(400).json({
          success: false,
          message: "Date filters are mandatory. Provide either specific_date OR from_date and to_date.",
          token
        });
      }

      // Add Registration Number condition
      whereConditions.push(`s.registration_number = $${paramIndex++}`);
      values.push(registration_number);

      // Date Filtering Logic
      if (specific_date) {
        joinConditions.push(`a.date = $${paramIndex++}`);
        values.push(new Date(specific_date).toISOString().split("T")[0]);
      } else if (from_date && to_date) {
        joinConditions.push(`a.date >= $${paramIndex++}`);
        values.push(new Date(from_date).toISOString().split("T")[0]);
        joinConditions.push(`a.date <= $${paramIndex++}`);
        values.push(new Date(to_date).toISOString().split("T")[0]);
      }
    } else {
      // --- GENERAL ADMIN ATTENDANCE LOGIC (Keep existing behavior) ---

      // Date condition for JOIN
      if (date && date.trim() !== "") {
        joinConditions.push(`a.date = $${paramIndex++}`);
        values.push(new Date(date).toISOString().split("T")[0]);
      }

      // Registration Number condition (if provided in general view, though usually not)
      if (registration_number && registration_number.trim() !== "") {
        whereConditions.push(`s.registration_number = $${paramIndex++}`);
        values.push(registration_number);
      }
    }

    // Common Filters (Department, Academic Year, Status)
    if (status && status.trim() !== "" && status !== "all") {
      joinConditions.push(`a.status = $${paramIndex++}`);
      values.push(status);
    }

    if (department && department.trim() !== "") {
      whereConditions.push(`s.department = $${paramIndex++}`);
      values.push(department);
    }

    if (academic_year && academic_year.trim() !== "") {
      whereConditions.push(`s.academic_year = $${paramIndex++}`);
      values.push(academic_year);
    }

    // Construct the JOIN and WHERE strings
    const joinClause = `LEFT JOIN attendance a ON ${joinConditions.join(" AND ")}`;
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // --- COUNT QUERY ---
    const countQuery = `
      SELECT COUNT(*) 
      FROM students s
      ${joinClause}
      ${whereClause}
    `;

    // --- DATA QUERY ---
    let selectFields = "";
    if (isStudentRequest) {
      // Optimized selection for student profile
      selectFields = `
        a.id AS attendance_id,
        a.date AS attendance_date,
        a.status AS attendance_status
        `;
    } else {
      // Full selection for admin table
      selectFields = `
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
        `;
    }

    const dataQuery = `
      SELECT 
        ${selectFields}
      FROM students s
      ${joinClause}
      ${whereClause}
      ORDER BY s.name
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    // Add limit and offset to values
    const queryValues = [...values, limit, offset];

    // Execute queries
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
