import pool from '../../../database/database.js';

export const getMessBillStatusByMonthYear = async (req, res) => {
  const client = await pool.connect();

  try {
    const { month_year } = req.body;

    // ✅ Validation
    if (!month_year) {
      return res.status(400).json({
        error: 'month_year (string) is required.'
      });
    }

    // ✅ Fetch monthly_base_cost_id for the given month
    const baseResult = await client.query(
      `SELECT id FROM monthly_base_costs WHERE month_year = $1`,
      [month_year]
    );

    if (baseResult.rows.length === 0) {
      return res.status(404).json({
        error: `month_year '${month_year}' not found.`
      });
    }

    const { id: monthly_base_cost_id } = baseResult.rows[0];

    // ✅ Fetch verification + show counts
    const statusCheck = await client.query(
      `SELECT 
          COUNT(*) AS total_count,
          COUNT(*) FILTER (WHERE verified = true) AS verified_count,
          COUNT(*) FILTER (WHERE show = true) AS show_count,
          COUNT(*) FILTER (WHERE ispaid = true) AS paid_count,
          COUNT(*) FILTER (WHERE ispaid = false OR ispaid IS NULL) AS unpaid_count
       FROM mess_bill_for_students
       WHERE monthly_base_cost_id = $1;`,
      [monthly_base_cost_id]
    );

    const { total_count, verified_count, show_count, paid_count, unpaid_count } = statusCheck.rows[0];

    if (parseInt(total_count) === 0) {
      return res.status(404).json({
        message: `❌ No records found for month_year '${month_year}'.`
      });
    }

    // ✅ Determine status
    let status = ['created'];

    if (parseInt(verified_count) === parseInt(total_count)) {
      status.push('verified');

      if (parseInt(show_count) === parseInt(total_count)) {
        status.push('published');
      }
    }

    return res.status(200).json({
      month_year,
      total_students: parseInt(total_count),
      verified_count: parseInt(verified_count),
      show_count: parseInt(show_count),
      paid_count: parseInt(paid_count),
      unpaid_count: parseInt(unpaid_count),
      status
    });

  } catch (error) {
    console.error('❌ Error fetching mess bill status:', error);
    return res.status(500).json({
      error: 'Internal server error.'
    });
  } finally {
    client.release();
  }
};
