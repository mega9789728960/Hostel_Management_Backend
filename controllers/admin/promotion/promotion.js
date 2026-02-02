import pool from "../../../database/database.js";
import bcrypt from "bcrypt";

export const promoteStudentsController = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, error: "Admin password is required" });
  }

  const client = await pool.connect();

  try {
    // 🔒 Verify Admin Password
    const adminId = req.user.id;
    const adminResult = await client.query("SELECT password FROM admins WHERE id = $1", [adminId]);

    if (adminResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    const validPassword = await bcrypt.compare(password, adminResult.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: "Incorrect password. Authorization failed." });
    }

    await client.query("BEGIN");

    // 1️⃣ Archive FINAL YEAR students (academic_year = '4')
    await client.query(`
      INSERT INTO students_archive (
        id,
        name,
        father_guardian_name,
        dob,
        blood_group,
        student_contact_number,
        parent_guardian_contact_number,
        address,
        department,
        academic_year,
        registration_number,
        roll_number,
        room_number,
        profile_photo,
        approved_by,
        status,
        email,
        password,
        batch_start_year,
        batch_end_year,
        created_at,
        updated_at,
        deleted_at
      )
      SELECT
        id,
        name,
        father_guardian_name,
        dob,
        blood_group,
        student_contact_number,
        parent_guardian_contact_number,
        address,
        department,
        academic_year,
        registration_number,
        roll_number,
        room_number,
        profile_photo,
        approved_by,
        status,
        email,
        password,
        batch_start_year,
        batch_end_year,
        created_at,
        updated_at,
        deleted_at
      FROM students
      WHERE academic_year = '4'
    `);

    // 2️⃣ Remove graduated students from main table
    await client.query(`
      DELETE FROM students
      WHERE academic_year = '4'
    `);

    // 3️⃣ Promote students (TOP → DOWN is CRITICAL)
    await client.query(`
      UPDATE students SET academic_year = '4' WHERE academic_year = '3'
    `);

    await client.query(`
      UPDATE students SET academic_year = '3' WHERE academic_year = '2'
    `);

    await client.query(`
      UPDATE students SET academic_year = '2' WHERE academic_year = '1'
    `);

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "✅ Student promotion completed successfully"
    });

  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("❌ Promotion failed:", error);

    res.status(500).json({
      success: false,
      message: "Student promotion failed",
      error: error.message
    });
  } finally {
    if (client) client.release();
  }
};

export default promoteStudentsController;
