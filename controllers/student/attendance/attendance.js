import isInHostel from "./isinhostel.js";
import pool from "../../../database/database.js";

async function attendance(req, res) {
  try {
    let id = req.body.id;
    if (req.user && req.user.id) id = req.user.id;
    id = parseInt(id);
    const token = req.body.token;

    // Check if this is a request to mark attendance (requires lat/lng)
    // If lat/lng are missing, assume it's a fetch request
    if (req.body.lat === undefined || req.body.lng === undefined) {
      console.log("Attendance fetch request for ID:", id, "Body ID:", req.body.id, "User ID:", req.user ? req.user.id : 'N/A');
      if (isNaN(id)) {
        console.error("Invalid Student ID:", id);
        return res.status(400).json({ success: false, error: "Invalid Student ID", token });
      }

      const query = `SELECT * FROM attendance WHERE student_id = $1 ORDER BY date DESC`;
      const result = await pool.query(query, [id]);

      return res.json({ success: true, data: result.rows, token });
    }

    const studentlat = parseFloat(req.body.lat);
    const studentlng = parseFloat(req.body.lng);

    // Validate inputs
    if (isNaN(studentlat) || isNaN(studentlng) || isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid input", token });
    }


    const hostellat = process.env.HOSTEL_LAT;
    const hostellng = process.env.HOSTEL_LNG;


    const isinHostel = isInHostel(studentlat, studentlng, hostellat, hostellng, process.env.RADIUS);

    if (!isinHostel) {
      return res.status(403).json({ success: false, error: "Student not inside hostel", token });
    }

    // Insert attendance
    const query = `
      INSERT INTO public.attendance (student_id, status)
      VALUES ($1, $2)
      ON CONFLICT (student_id, date) DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(query, [id, "Present"]);

    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Attendance already marked for today", token: req.body.token });
    }

    return res.json({ success: true, attendance: result.rows[0], token: req.body.token });
  } catch (err) {
    console.error("Error in attendance controller:", err);
    return res.status(500).json({ success: false, error: "Server error", token: req.body.token });
  }
}

export default attendance;
