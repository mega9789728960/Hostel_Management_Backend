import pool from "../../../database/database.js";

async function studentsupdate(req, res) {
  try {
    const { token,
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
      batch_start_year,
      batch_end_year
    } = req.body;

    const query = `
      UPDATE students
      SET 
        name = $1,
        father_guardian_name = $2,
        dob = $3,
        blood_group = $4,
        student_contact_number = $5,
        parent_guardian_contact_number = $6,
        address = $7,
        department = $8,
        academic_year = $9,
        registration_number = $10,
        roll_number = $11,
        room_number = $12,
        profile_photo = $13,
        batch_start_year = $14,
        batch_end_year = $15
      WHERE id = $16
      RETURNING *;
    `;

    const values = [
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
      batch_start_year,
      batch_end_year,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found", token });
    }

    return res.json({ success: true, data: result.rows[0], token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e.message, token });
  }
}

export default studentsupdate;
