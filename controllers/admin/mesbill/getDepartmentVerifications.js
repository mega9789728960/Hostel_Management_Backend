import pool from '../../../database/database.js';

export const getDepartmentVerifications = async (req, res) => {
    const client = await pool.connect();
    try {
        const { monthly_year_data_id } = req.body;

        if (!monthly_year_data_id) {
            return res.status(400).json({ error: 'monthly_year_data_id is required' });
        }

        // Query to aggregate verification status by Dept and Year
        // Checks if all bills for that Dept/Year are verified.
        // If even one bill is not verified (verified column is false or null), result is false.
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
                m.monthly_year_data_id = $1
            GROUP BY
                s.department, s.academic_year
        `;

        const result = await client.query(query, [monthly_year_data_id]);

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
