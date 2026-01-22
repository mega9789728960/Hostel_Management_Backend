import pool from "../../../database/database.js"; // Adjust path if needed

export const createMonthlyCalculation = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction

    const {
      month_year,
      grocery_cost,
      vegetable_cost,
      gas_charges,
      total_milk_litres,
      milk_cost_per_litre,
      milk_charges_computed,
      other_costs,
      deductions_income,
      veg_extra_per_day,
      nonveg_extra_per_day,
      total_expenditure,
      expenditure_after_income,
      mess_fee_per_day,
      veg_served_days,
      nonveg_served_days,
      years_data // Array of objects: [{ year, total_students, total_days }]
    } = req.body;

    // 🧩 Validation
    // 🧩 Validation
    const requiredYears = [1, 2, 3, 4];
    if (!month_year || !Array.isArray(years_data)) {
      return res.status(400).json({ error: "month_year and years_data array are required" });
    }

    // Validate that all required years are present and have valid data
    const existingYears = years_data.map(y => parseInt(y.year));
    const missingYears = requiredYears.filter(y => !existingYears.includes(y));

    if (missingYears.length > 0) {
      return res.status(400).json({ error: `Missing data for years: ${missingYears.join(', ')}` });
    }

    // Validate structure of each year data
    for (const data of years_data) {
      if (!data.year || !data.total_students || !data.total_days ||
        parseInt(data.total_students) < 0 || parseInt(data.total_days) < 0) {
        return res.status(400).json({ error: `Invalid data for year ${data.year}. total_students and total_days are required.` });
      }
    }

    // 1️⃣ Insert into monthly_base_costs
    const baseInsertQuery = `
      INSERT INTO public.monthly_base_costs (
        month_year, grocery_cost, vegetable_cost, gas_charges,
        total_milk_litres, milk_cost_per_litre, milk_charges_computed,
        other_costs, deductions_income, veg_extra_per_day, nonveg_extra_per_day,
        total_expenditure, expenditure_after_income, mess_fee_per_day,
        veg_served_days, nonveg_served_days
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING id;
    `;

    const baseValues = [
      month_year,
      grocery_cost ?? null,
      vegetable_cost ?? null,
      gas_charges ?? null,
      total_milk_litres ?? null,
      milk_cost_per_litre ?? null,
      milk_charges_computed ?? null,
      other_costs ?? null,
      deductions_income ?? null,
      veg_extra_per_day ?? null,
      nonveg_extra_per_day ?? null,
      total_expenditure ?? null,
      expenditure_after_income ?? null,
      mess_fee_per_day ?? null,
      veg_served_days ?? null,
      nonveg_served_days ?? null
    ];

    const baseResult = await client.query(baseInsertQuery, baseValues);
    const baseId = baseResult.rows[0].id;

    // 2️⃣ Insert into monthly_year_data for each year
    const insertedYears = [];

    for (const y of years_data) {
      const { year, total_students, total_days } = y;

      const yearInsertQuery = `
        INSERT INTO public.monthly_year_data (
          monthly_base_id, year, total_students, total_days
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, year;
      `;

      const result = await client.query(yearInsertQuery, [
        baseId,
        year,
        total_students ?? null,
        total_days ?? null
      ]);

      insertedYears.push(result.rows[0]);
    }

    // 3️⃣ Insert mess_bill_for_students via JOIN for each inserted year
    for (const yr of insertedYears) {
      const { id: monthlyYearDataId, year } = yr;

      const insertJoinQuery = `
        INSERT INTO public.mess_bill_for_students (
          student_id,
          monthly_year_data_id,
          monthly_base_cost_id
        )
        SELECT 
          s.id AS student_id,
          myd.id AS monthly_year_data_id,
          mbc.id AS monthly_base_cost_id
        FROM public.students s
        JOIN public.monthly_year_data myd 
          ON myd.year = s.academic_year::int
        JOIN public.monthly_base_costs mbc 
          ON mbc.id = $1
        WHERE myd.id = $2
        ON CONFLICT (student_id, monthly_base_cost_id) DO NOTHING;
      `;

      await client.query(insertJoinQuery, [baseId, monthlyYearDataId]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: `✅ Monthly calculation and mess bills created successfully for ${month_year}`,
      base_id: baseId,
      year_data_inserted: insertedYears
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error in createMonthlyCalculation:", error);

    if (error.code === "23505") {
      return res.status(400).json({ error: "Record for this month_year already exists." });
    }

    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};
