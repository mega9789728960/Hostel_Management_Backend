import pool from "../../../database/database.js";

async function showattendance(req, res) {
    try {
        const {
            token,
            // Filters
            startDate,
            endDate,
            date, // precise date if needed
            status,
            // Pagination
            page = 1,
            limit = 10
        } = req.body || {};

        // Get student_id from middleware (req.user)
        const student_id = req.user ? req.user.id : null;

        if (!student_id) {
            return res.status(401).json({ success: false, error: "Unauthorized: No student ID found", token });
        }

        const offset = (page - 1) * limit;

        // Conditions
        const whereConditions = [`student_id = $1`];
        const values = [student_id];
        let paramIndex = 2;

        // Filters implementation

        // Optional specific date
        if (date && date.trim() !== "") {
            whereConditions.push(`date = $${paramIndex++}`);
            values.push(new Date(date).toISOString().split("T")[0]);
        }

        // Date Range
        if (startDate && startDate.trim() !== "") {
            whereConditions.push(`date >= $${paramIndex++}`);
            values.push(new Date(startDate).toISOString().split("T")[0]);
        }

        if (endDate && endDate.trim() !== "") {
            whereConditions.push(`date <= $${paramIndex++}`);
            values.push(new Date(endDate).toISOString().split("T")[0]);
        }

        if (status && status.trim() !== "" && status !== "all") {
            whereConditions.push(`status = $${paramIndex++}`);
            values.push(status);
        }

        const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

        // Count Query
        const countQuery = `SELECT COUNT(*) FROM attendance ${whereClause}`;

        // Data query
        const dataQuery = `
      SELECT 
        id,
        student_id,
        date,
        status,
        created_at,
        updated_at
      FROM attendance
      ${whereClause}
      ORDER BY date DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

        const queryValues = [...values, limit, offset];

        const [countResult, dataResult] = await Promise.all([
            pool.query(countQuery, values),
            pool.query(dataQuery, queryValues)
        ]);

        const totalRecords = parseInt(countResult.rows[0].count, 10);
        const rows = dataResult.rows;

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
        console.error("❌ Error fetching student attendance:", err);
        return res.status(500).json({ success: false, error: "Server error", token: req.body?.token });
    }
}

export default showattendance;
