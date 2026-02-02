import pool from "../../../database/database.js";
import bcrypt from "bcrypt";

export const promoteStudentsController = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, error: "Admin password is required" });
  }

  const client = await pool.connect();

  try {
    /* =======================
       🔒 ADMIN AUTH CHECK
    ======================= */
    const adminId = req.user.id;

    const adminResult = await client.query(
      "SELECT password FROM admins WHERE id = $1",
      [adminId]
    );

    if (adminResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      adminResult.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password. Authorization failed."
      });
    }

    await client.query("BEGIN");

    /* =====================================================
       1️⃣ ARCHIVE PAYMENTS (FINAL YEAR)
    ===================================================== */
    await client.query(`
      INSERT INTO payments_archive (
        id, order_id, order_amount, order_currency, cf_payment_id,
        payment_status, payment_amount, payment_time, bank_reference,
        payment_method, customer_id, customer_name, customer_email,
        customer_phone, gateway_name, gateway_payment_id,
        gateway_order_id, gateway_settlement, raw_webhook,
        mess_bill_for_students_id, created_at, updated_at
      )
      SELECT
        p.id, p.order_id, p.order_amount, p.order_currency, p.cf_payment_id,
        p.payment_status, p.payment_amount, p.payment_time, p.bank_reference,
        p.payment_method, p.customer_id, p.customer_name, p.customer_email,
        p.customer_phone, p.gateway_name, p.gateway_payment_id,
        p.gateway_order_id, p.gateway_settlement, p.raw_webhook,
        p.mess_bill_for_students_id, p.created_at, p.updated_at
      FROM payments p
      JOIN mess_bill_for_students mbs ON mbs.id = p.mess_bill_for_students_id
      JOIN students s ON s.id = mbs.student_id
      WHERE s.academic_year = '4'
    `);

    await client.query(`
      DELETE FROM payments
      WHERE mess_bill_for_students_id IN (
        SELECT mbs.id
        FROM mess_bill_for_students mbs
        JOIN students s ON s.id = mbs.student_id
        WHERE s.academic_year = '4'
      )
    `);

    /* =====================================================
       2️⃣ ARCHIVE MESS BILLS
    ===================================================== */
    await client.query(`
      INSERT INTO mess_bill_for_students_archive (
        id, student_id, status, latest_order_id,
        monthly_year_data_id, monthly_base_cost_id,
        number_of_days, isveg, veg_days, non_veg_days,
        ispaid, paid_date, verified, show,
        created_at, updated_at
      )
      SELECT
        id, student_id, status, latest_order_id,
        monthly_year_data_id, monthly_base_cost_id,
        number_of_days, isveg, veg_days, non_veg_days,
        ispaid, paid_date, verified, show,
        created_at, updated_at
      FROM mess_bill_for_students
      WHERE student_id IN (
        SELECT id FROM students WHERE academic_year = '4'
      )
    `);

    await client.query(`
      DELETE FROM mess_bill_for_students
      WHERE student_id IN (
        SELECT id FROM students WHERE academic_year = '4'
      )
    `);

    /* =====================================================
       3️⃣ ARCHIVE STUDENTS
    ===================================================== */
    await client.query(`
      INSERT INTO students_archive (
        id, name, father_guardian_name, dob, blood_group,
        student_contact_number, parent_guardian_contact_number,
        address, department, academic_year,
        registration_number, roll_number, room_number,
        profile_photo, approved_by, status,
        email, password, batch_start_year, batch_end_year,
        created_at, updated_at, deleted_at
      )
      SELECT
        id, name, father_guardian_name, dob, blood_group,
        student_contact_number, parent_guardian_contact_number,
        address, department, academic_year,
        registration_number, roll_number, room_number,
        profile_photo, approved_by, status,
        email, password, batch_start_year, batch_end_year,
        created_at, updated_at, deleted_at
      FROM students
      WHERE academic_year = '4'
    `);

    await client.query(`
      DELETE FROM students
      WHERE academic_year = '4'
    `);

    /* =====================================================
       4️⃣ PROMOTE STUDENTS (ORDER IS CRITICAL)
    ===================================================== */
    await client.query(`UPDATE students SET academic_year = '4' WHERE academic_year = '3'`);
    await client.query(`UPDATE students SET academic_year = '3' WHERE academic_year = '2'`);
    await client.query(`UPDATE students SET academic_year = '2' WHERE academic_year = '1'`);

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "✅ Promotion & graduation completed successfully"
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Promotion failed:", error);

    res.status(500).json({
      success: false,
      message: "Student promotion failed",
      error: error.message
    });
  } finally {
    client.release();
  }
};

export default promoteStudentsController;
