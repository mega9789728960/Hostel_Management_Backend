import pool from "../../../../database/database.js";

async function complaintstatuschangeforadmin(req, res) {
  try {
    const { complaint_id, status, token } = req.body;

    if (!complaint_id || !status) {
      return res.status(400).json({
        success: false,
        message: "complaint_id and status are required",
        token
      });
    }

    const normalizedStatus = status.toLowerCase();
    const isResolved = normalizedStatus === 'resolved';

    // Construct the update query
    // We update the status and updated_at timestamp.
    // If the new status is 'resolved', we set resolved=true and resolved_at=NOW().
    // If the new status is NOT 'resolved', we revert resolved=false and resolved_at=NULL (in case it was previously resolved and is being reopened).

    const query = `
      UPDATE complaints 
      SET 
        status = $1, 
        updated_at = NOW(),
        resolved = $2,
        resolved_at = CASE WHEN $2 = true THEN NOW() ELSE NULL END
      WHERE id = $3
      RETURNING *
    `;

    const values = [normalizedStatus, isResolved, complaint_id];

    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      return res.json({
        success: true,
        message: `Complaint status updated to '${normalizedStatus}'`,
        data: result.rows[0],
        token
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
        token
      });
    }

  } catch (error) {
    console.error("Error updating complaint status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      token: req.body.token
    });
  }
}

export default complaintstatuschangeforadmin;
