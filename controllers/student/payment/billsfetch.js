import pool from '../../../database/database.js';

const showPaidMessBillsByStudentId = async (req, res) => {
  try {
    const {
      student_id,
      page = 1,
      limit = 10
    } = req.body; // or req.query for GET requests

    if (!student_id) {
      return res.status(400).json({ error: "student_id is required" });
    }

    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) 
      FROM mess_bill_for_students mb
      LEFT JOIN monthly_base_costs mbc
        ON mb.monthly_base_cost_id = mbc.id
      WHERE mb.student_id = $1 
    `;

    const dataQuery = `
      SELECT 
        mb.id AS mess_bill_id,
        mb.student_id,
        mb.monthly_base_cost_id AS base_id,
        mb.monthly_year_data_id AS year_data_id,
        mb.number_of_days,
        mb.status,
        mb.latest_order_id,
        mb.paid_date,        -- Added paid_date
        mb.created_at,
        mb.updated_at,
        mb.show,
        mb.verified,
        mb.isveg,
        mb.veg_days,
        mb.non_veg_days,
        mbc.month_year,
        mbc.grocery_cost,
        mbc.vegetable_cost,
        mbc.gas_charges,
        mbc.total_milk_litres,
        mbc.milk_cost_per_litre,
        mbc.milk_charges_computed,
        mbc.deductions_income,
        mbc.veg_extra_per_day,
        mbc.nonveg_extra_per_day,
        mbc.total_expenditure,
        mbc.expenditure_after_income,
        mbc.mess_fee_per_day,
       
        mbc.veg_served_days,
        mbc.nonveg_served_days,
        mbc.reduction_applicable_days
      FROM mess_bill_for_students mb
      LEFT JOIN monthly_base_costs mbc
        ON mb.monthly_base_cost_id = mbc.id
      WHERE mb.student_id = $1 
      ORDER BY mbc.month_year DESC NULLS LAST
      LIMIT $2 OFFSET $3;
    `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, [student_id]),
      pool.query(dataQuery, [student_id, limit, offset])
    ]);

    const totalRecords = parseInt(countResult.rows[0].count, 10);
    const rows = dataResult.rows;

    res.json({
      success: true,
      message: rows.length === 0 ? "No paid mess bills found for this student." : "Paid mess bills fetched successfully",
      data: rows,
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    console.error("Error fetching mess bills:", error);
    res.status(500).json({ error: "Failed to fetch paid mess bills" });
  }
};

export default showPaidMessBillsByStudentId;
