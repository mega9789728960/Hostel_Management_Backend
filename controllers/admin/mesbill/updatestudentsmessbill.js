import pool from '../../../database/database.js'; // adjust path

export const updateMessBill = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      id,
      student_id,
      status,
      latest_order_id,
      monthly_year_data_id,
      number_of_days,
      monthly_base_cost_id,
      show,
      verified,
      isveg,
      veg_days,
      non_veg_days,
      paid_date,
      ispaid
    } = req.body;

    // 🔒 Validation
    if (!id) {
      return res.status(400).json({ error: "id (mess_bill_id) is required" });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    // 🧠 Build dynamic fields
    // Fields allowed to update
    if (student_id !== undefined) { fields.push(`student_id = $${idx}`); values.push(student_id); idx++; }
    if (status !== undefined) { fields.push(`status = $${idx}`); values.push(status); idx++; }
    if (latest_order_id !== undefined) { fields.push(`latest_order_id = $${idx}`); values.push(latest_order_id); idx++; }
    if (monthly_year_data_id !== undefined) { fields.push(`monthly_year_data_id = $${idx}`); values.push(monthly_year_data_id); idx++; }
    if (number_of_days !== undefined) { fields.push(`number_of_days = $${idx}`); values.push(number_of_days); idx++; }
    if (monthly_base_cost_id !== undefined) { fields.push(`monthly_base_cost_id = $${idx}`); values.push(monthly_base_cost_id); idx++; }
    if (show !== undefined) { fields.push(`show = $${idx}`); values.push(show); idx++; }
    if (verified !== undefined) { fields.push(`verified = $${idx}`); values.push(verified); idx++; }
    if (paid_date !== undefined) { fields.push(`paid_date = $${idx}`); values.push(paid_date); idx++; }
    if (ispaid !== undefined) { fields.push(`ispaid = $${idx}`); values.push(ispaid); idx++; }

    // Special logic for veg/non-veg
    if (isveg !== undefined) {
      fields.push(`isveg = $${idx}`);
      values.push(isveg);
      idx++;

      // 🌱 Logic based on veg/non-veg selection
      if (isveg === true) {
        // Veg case → assign veg_days, reset non_veg_days
        const vegValue = veg_days !== undefined ? veg_days : 30; // default 30 or your logic
        fields.push(`veg_days = $${idx}`);
        values.push(vegValue);
        idx++;

        fields.push(`non_veg_days = 0`);
      } else if (isveg === false) {
        // Non-veg case → assign non_veg_days, reset veg_days
        const nonVegValue = non_veg_days !== undefined ? non_veg_days : 30;
        fields.push(`non_veg_days = $${idx}`);
        values.push(nonVegValue);
        idx++;

        fields.push(`veg_days = 0`);
      }
    } else {
      // If isveg is NOT changing, but veg_days or non_veg_days ARE changing
      if (veg_days !== undefined) { fields.push(`veg_days = $${idx}`); values.push(veg_days); idx++; }
      if (non_veg_days !== undefined) { fields.push(`non_veg_days = $${idx}`); values.push(non_veg_days); idx++; }
    }

    // 🧩 No fields to update
    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    // WHERE condition
    values.push(id);

    // 🧾 Construct SQL query
    const updateQuery = `
      UPDATE public.mess_bill_for_students
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING *;
    `;

    // Execute query
    const result = await client.query(updateQuery, values);

    // Handle not found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mess bill not found" });
    }

    // ✅ Success
    res.status(200).json({
      message: "✅ Mess bill updated successfully",
      updated_bill: result.rows[0],
    });

  } catch (error) {
    console.error("❌ Error updating mess bill:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};
