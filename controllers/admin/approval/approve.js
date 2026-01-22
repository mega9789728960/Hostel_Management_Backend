import pool from "../../../database/database.js";

async function approveStudent(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required"
      });
    }

    // Update status to true for the given student ID
    const query = `
      UPDATE students
      SET status = true
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student approved successfully",
      student: result.rows[0]
    });

  } catch (err) {
    console.error("Error approving student:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}

export default approveStudent;
