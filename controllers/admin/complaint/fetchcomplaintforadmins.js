import pool from "../../../database/database.js";

async function fetchcomplaintforadmins(req, res) {
  try {
    const {
      token,
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      resolved,
      student_id,
      from_date,
      to_date,
      search
    } = req.body;

    const offset = (page - 1) * limit;
    const values = [];
    let paramIndex = 1;
    const conditions = [];

    // --- Dynamic Filtering ---

    // Filter by Status
    if (status && status !== "all") {
      conditions.push(`c.status ILIKE $${paramIndex++}`);
      values.push(status);
    }

    // Filter by Priority
    if (priority && priority !== "all") {
      conditions.push(`c.priority ILIKE $${paramIndex++}`);
      values.push(priority);
    }

    // Filter by Category
    if (category && category !== "all") {
      conditions.push(`c.category ILIKE $${paramIndex++}`);
      values.push(category);
    }

    // Filter by Resolved Status (boolean)
    if (resolved !== undefined && resolved !== "all") {
      conditions.push(`c.resolved = $${paramIndex++}`);
      values.push(String(resolved) === "true");
    }

    // Filter by Student ID
    if (student_id) {
      conditions.push(`c.student_id = $${paramIndex++}`);
      values.push(student_id);
    }

    // Filter by Date Range (created_at)
    if (from_date) {
      conditions.push(`c.created_at >= $${paramIndex++}`);
      values.push(from_date);
    }
    if (to_date) {
      conditions.push(`c.created_at <= $${paramIndex++}`);
      values.push(to_date);
    }

    // Search Functionality
    // Searches in Complaint Title, Description, Student Name, or Registration Number
    if (search && search.trim() !== "") {
      conditions.push(`(
        c.title ILIKE $${paramIndex} OR 
        c.description ILIKE $${paramIndex} OR 
        s.name ILIKE $${paramIndex} OR
        s.registration_number ILIKE $${paramIndex}
      )`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // --- Queries ---

    // 1. Count Total Records (for Pagination)
    const countQuery = `
      SELECT COUNT(*) 
      FROM complaints c
      JOIN students s ON c.student_id = s.id
      ${whereClause}
    `;

    // 2. Fetch Data
    const dataQuery = `
      SELECT 
        c.*, 
        s.name as student_name, 
        s.registration_number,
        s.department,
        s.room_number,
        s.email as student_email
      FROM complaints c
      JOIN students s ON c.student_id = s.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    // Add limit and offset to values for the data query
    const dataValues = [...values, limit, offset];

    // Execute queries in parallel
    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, values),
      pool.query(dataQuery, dataValues),
    ]);

    const totalRecords = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalRecords / limit);

    // --- Response ---

    if (dataResult.rows.length === 0) {
      return res.json({
        success: false,
        message: "No complaints found matching criteria",
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          currentPage: parseInt(page),
          limit: parseInt(limit)
        },
        token
      });
    }

    return res.json({
      success: true,
      data: dataResult.rows,
      pagination: {
        total: totalRecords,
        totalPages: totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      token,
    });

  } catch (err) {
    console.error("Error fetching complaints for admins:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      token: req.body?.token,
    });
  }
}

export default fetchcomplaintforadmins;
