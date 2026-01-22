import pool from "../../../database/database.js";

async function adminreject(req, res) {
  try {
    const { id } = req.params;
    const { reason, token } = req.body;

    // ✅ Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
        token
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
        token
      });
    }

    // ✅ Update student status using ID
    const updateResult = await pool.query(
      `UPDATE students 
       SET status = $1 
       WHERE id = $2 
       RETURNING id, registration_number, email, status`,
      [false, id]
    );

    // ✅ Check if student exists
    if (updateResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No student found with this ID",
        token
      });
    }

    const updatedStudent = updateResult.rows[0];

    // ✅ Insert rejection reason
    await pool.query(
      `INSERT INTO rejection_reasons (student_id, reason) VALUES ($1, $2)`,
      [updatedStudent.id, reason]
    );

    return res.status(200).json({
      success: true,
      message: "Student rejected successfully",
      student: updatedStudent,
      token,
    });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
      token
    });
  }
}

export default adminreject;
