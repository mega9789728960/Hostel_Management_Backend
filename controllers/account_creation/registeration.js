import pool from "../../database/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function registration(req, res) {
  try {
    const {
      email,
      password,
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

    // ✅ Validate required fields upfront
    if (!email || !password || !name || !registration_number) {
      return res.status(400).json({
        success: false,
        message: "Email, password, name, and registration number are required",
      });
    }

    // ✅ Step 0: Check if email already exists
    const existingUser = await pool.query(
      "SELECT id FROM students WHERE email = $1 LIMIT 1",
      [email]
    );
    if (existingUser.rows.length) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // ✅ Step 1: Check verification status
    const verificationResult = await pool.query(
      "SELECT * FROM registration_email_verification WHERE email = $1 LIMIT 1",
      [email]
    );

    const token = req.body.token
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const step = verificationResult.rows[0].step;
    const expire = verificationResult.rows[0].entire_expire;
    if (expire && expire < new Date()) {
      return res.json({ success: false, error: " time out" })
    }

    if (step != '4' && step != '5') {
      return res.json({ success: false, message: "you are not in correct step" });
    }
    const token1 = verificationResult.rows[0].token;

    if (token != token1) {
      return res.json({ success: false, message: "incorrect token" });

    }

    const sequence = verificationResult.rows[0].sequence;
    if (decode.sequence != sequence) {

      return res.json({ success: false, message: "incorrect  sequence " });

    }

    const verificationData = verificationResult.rows[0];

    if (!verificationData || !verificationData.verified) {
      return res.status(400).json({
        success: false,
        message: verificationData ? "Email is not verified yet" : "No verification found for this email",
      });
    }

    // ✅ Step 2: Hash password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10

    // ✅ Step 3: Insert into students table (return only necessary columns)
    const insertQuery = `
      (email, password, name, father_guardian_name, dob, blood_group, student_contact_number, parent_guardian_contact_number, address, department, academic_year, registration_number, roll_number, room_number, profile_photo, batch_start_year, batch_end_year) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) 
      RETURNING id, email, name, registration_number, department, academic_year
    `;

    const studentResult = await pool.query(insertQuery, [
      email,
      hashedPassword,
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
    ]);

    await pool.query(`DELETE FROM registration_email_verification WHERE email = $1`, [email])
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: studentResult.rows[0],
    });

  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

export default registration;
