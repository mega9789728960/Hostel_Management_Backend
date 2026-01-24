import pool from '../../../database/database.js';

export const fetchPaidUnpaidBills = async (req, res) => {
    const client = await pool.connect();
    try {
        const { month_year, status, department, year } = req.body;

        if (!month_year) {
            return res.status(400).json({ error: 'Month-Year is required' });
        }

        // Base query
        let query = `
      SELECT 
        s.id AS student_id,
        s.name,
        s.register_number,
        s.department,
        s.year,
        s.room_no,
        mbs.id AS bill_id,
        mbs.status,
        mbs.paid_date,
        mbs.number_of_days,
        mbs.veg_days,
        mbs.non_veg_days,
        mbc.mess_fee_per_day
      FROM public.mess_bill_for_students mbs
      JOIN public.students s ON mbs.student_id = s.id
      JOIN public.monthly_base_costs mbc ON mbs.monthly_base_cost_id = mbc.id
      WHERE mbc.month_year = $1
    `;

        const values = [month_year];
        let paramIndex = 2;

        // Optional filters
        if (status) {
            const normalizedStatus = status.toUpperCase();
            if (normalizedStatus === 'PAID') {
                // Match any status that implies paid
                query += ` AND mbs.status = $${paramIndex}`;
                values.push('PAID');
            } else if (normalizedStatus === 'UNPAID' || normalizedStatus === 'PENDING') {
                query += ` AND (mbs.status = 'PENDING' OR mbs.status = 'UNPAID')`;
            } else {
                query += ` AND mbs.status = $${paramIndex}`;
                values.push(status); // Use original value but could use normalized if stored as uppercase
            }
            if (normalizedStatus !== 'UNPAID' && normalizedStatus !== 'PENDING') paramIndex++;
        }

        if (department) {
            query += ` AND s.department = $${paramIndex}`;
            values.push(department);
            paramIndex++;
        }

        if (year) {
            query += ` AND s.year = $${paramIndex}`;
            values.push(year);
            paramIndex++;
        }

        query += ` ORDER BY s.department, s.year, s.name`;

        const result = await client.query(query, values);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.error('Error fetching paid/unpaid bills:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
};
