import pool from '../../../database/database.js';

const fetchStudentPayments = async (req, res) => {
    try {
        const { student_id, month, year, page = 1, limit = 10 } = req.body;

        if (!student_id) {
            return res.status(400).json({ success: false, message: "Student ID (customer_id) is required" });
        }

        let query = `
      SELECT 
        id,
        order_id,
        order_amount,
        payment_amount,
        payment_status,
        payment_time,
        payment_method,
        gateway_payment_id,
        mess_bill_for_students_id
      FROM public.payments
      WHERE customer_id = $1
    `;

        const queryParams = [student_id];
        let paramCounter = 2;

        if (month) {
            query += ` AND EXTRACT(MONTH FROM payment_time) = $${paramCounter}`;
            queryParams.push(month);
            paramCounter++;
        }

        if (year) {
            query += ` AND EXTRACT(YEAR FROM payment_time) = $${paramCounter}`;
            queryParams.push(year);
            paramCounter++;
        }

        query += ` ORDER BY payment_time DESC`;

        // Pagination
        const offset = (page - 1) * limit;
        query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
        queryParams.push(limit, offset);

        const result = await pool.query(query, queryParams);

        // Count for pagination
        let countQuery = `SELECT COUNT(*) FROM public.payments WHERE customer_id = $1`;
        const countParams = [student_id];
        let countParamCounter = 2;

        if (month) {
            countQuery += ` AND EXTRACT(MONTH FROM payment_time) = $${countParamCounter}`;
            countParams.push(month);
            countParamCounter++;
        }

        if (year) {
            countQuery += ` AND EXTRACT(YEAR FROM payment_time) = $${countParamCounter}`;
            countParams.push(year);
            countParamCounter++;
        }

        const countResult = await pool.query(countQuery, countParams);
        const totalRecords = parseInt(countResult.rows[0].count, 10);

        res.status(200).json({
            success: true,
            data: result.rows,
            pagination: {
                total: totalRecords,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalRecords / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default fetchStudentPayments;
