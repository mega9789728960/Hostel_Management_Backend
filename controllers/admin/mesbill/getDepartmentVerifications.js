import pool from '../../../database/database.js';

export const getDepartmentVerifications = async (req, res) => {
    const client = await pool.connect();
    try {
        const { month_year } = req.body;

        if (!month_year) {
            return res.status(400).json({ error: 'month_year is required' });
        }

        // 1. Get monthly_base_cost_id for the given month_year
        const baseCostResult = await client.query(
            `SELECT id FROM monthly_base_costs WHERE month_year = $1`,
            [month_year]
        );

        if (baseCostResult.rows.length === 0) {
            // If no base cost exists for this month, implies no bills. Return empty result.
            return res.status(200).json({ success: true, result: [] });
        }

        const monthly_base_cost_id = baseCostResult.rows[0].id;

        // 2. Query to aggregate verification status by Dept and Year
        // Checks if all bills for that Dept/Year are verified.
        const query = `
            SELECT
                s.department,
                s.academic_year,
                BOOL_AND(m.verified) as all_verified,
                COUNT(*) as bill_count
            FROM
                mess_bill_for_students m
            JOIN
                students s ON m.student_id = s.id
            WHERE
                m.monthly_base_cost_id = $1
            GROUP BY
                s.department, s.academic_year
        `;

        const result = await client.query(query, [monthly_base_cost_id]);

        // Format data for easier frontend consumption
        // Return a list of records
        res.status(200).json({ success: true, result: result.rows });

    } catch (e) {
        console.error('Error fetching department verifications:', e);
        res.status(500).json({ error: e.message });
    } finally {
        client.release();
    }
};
