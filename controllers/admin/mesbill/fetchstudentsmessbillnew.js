import pool from '../../../database/database.js';

export const fetchMessBills = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      month_year,
      department,
      academic_year,
      page = 1,
      limit = 10
    } = req.body;

    // 🚫 Mandatory fields validation
    if (!month_year || !department || !academic_year) {
      return res.status(400).json({
        error: "month_year, department, and academic_year are required fields."
      });
    }

    // Calculate offset
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitVal = parseInt(limit);

    // Common WHERE clause conditions
    const whereClause = `
      WHERE mbc.month_year = $1
      AND s.department = $2
      AND s.academic_year = $3
    `;

    // 🔢 Count Query
    const countQuery = `
      SELECT COUNT(*) 
      FROM monthly_base_costs mbc
      JOIN monthly_year_data myd ON myd.monthly_base_id = mbc.id
      JOIN students s ON s.academic_year::integer = myd.year
      LEFT JOIN mess_bill_for_students mbfs 
        ON mbfs.monthly_year_data_id = myd.id
        AND mbfs.student_id = s.id
        AND mbfs.monthly_base_cost_id = mbc.id
      ${whereClause}
    `;

    // 🧠 Data Query — includes veg/non-veg extra cost logic
    const dataQuery = `
      SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.registration_number,
        s.department,
        s.academic_year,

        mbc.id AS monthly_base_cost_id,
        mbc.month_year AS mess_bill_month,
        mbc.mess_fee_per_day,
        mbc.veg_extra_per_day,
        mbc.nonveg_extra_per_day,

        myd.id AS monthly_year_data_id,
        myd.total_days AS total_days_in_month,

        mbfs.id AS mess_bill_id,
        mbfs.status AS payment_status,
        mbfs.ispaid,
        mbfs.number_of_days,
        mbfs.verified,
        mbfs.isveg,
        mbfs.veg_days,
        mbfs.non_veg_days,
        mbfs.created_at,
        mbfs.updated_at,

        -- ✅ Determine effective days
        COALESCE(mbfs.number_of_days, myd.total_days) AS effective_number_of_days,

        -- ✅ Revised Veg/Non-Veg Calculation
        CASE
          WHEN mbfs.isveg = TRUE THEN 
            (
              COALESCE(mbfs.veg_days, 0) * mbc.veg_extra_per_day
              + COALESCE(mbfs.number_of_days, myd.total_days) * mbc.mess_fee_per_day
            )
          WHEN mbfs.isveg = FALSE THEN 
            (
              COALESCE(mbfs.non_veg_days, 0) * mbc.nonveg_extra_per_day
              + COALESCE(mbfs.number_of_days, myd.total_days) * mbc.mess_fee_per_day
            )
          ELSE 
            COALESCE(mbfs.number_of_days, myd.total_days) * mbc.mess_fee_per_day
        END AS total_amount

      FROM monthly_base_costs mbc
      JOIN monthly_year_data myd 
        ON myd.monthly_base_id = mbc.id
      JOIN students s 
        ON s.academic_year::integer = myd.year
      LEFT JOIN mess_bill_for_students mbfs 
        ON mbfs.monthly_year_data_id = myd.id
        AND mbfs.student_id = s.id
        AND mbfs.monthly_base_cost_id = mbc.id

      ${whereClause}

      ORDER BY s.registration_number
      LIMIT $4 OFFSET $5
    `;

    const values = [month_year, department, academic_year];

    // Execute queries in parallel
    const [countResult, dataResult] = await Promise.all([
      client.query(countQuery, values),
      client.query(dataQuery, [...values, limitVal, offset])
    ]);

    const totalRecords = parseInt(countResult.rows[0].count, 10);
    const rows = dataResult.rows;

    if (totalRecords === 0) {
      return res.status(404).json({
        message: "No records found for the given filters.",
        filters: { month_year, department, academic_year },
        data: [],
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        totalPages: 0
      });
    }

    // ✅ Success
    res.status(200).json({
      message: "Mess bill data fetched successfully.",
      filters: { month_year, department, academic_year },
      count: rows.length,
      data: rows,
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalRecords,
      totalPages: Math.ceil(totalRecords / limitVal)
    });

  } catch (error) {
    console.error('❌ Error in fetchMessBills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
