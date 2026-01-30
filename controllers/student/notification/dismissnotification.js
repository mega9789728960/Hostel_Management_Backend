import pool from "../../../database/database.js";

async function dismissnotification(req, res) {
  try {
    const { notification_id } = req.body;

    // 1️⃣ Validate input
    if (!notification_id) {
      return res.status(400).json({
        success: false,
        message: "notification_id is required",
      });
    }

    // 2️⃣ Execute the DELETE query
    // 2️⃣ Execute the DELETE query
    // If we have user info, ensure they own the notification
    let query = `DELETE FROM students_dashboard_notifications WHERE id = $1`;
    let values = [notification_id];

    if (req.user && req.user.id) {
      query += ` AND student_id = $2`;
      values.push(req.user.id);
    }

    const result = await pool.query(query, values);

    // 3️⃣ Check if any row was deleted
    if (result.rowCount > 0) {
      return res.json({
        success: true,
        message: "Notification deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting notification",
    });
  }
}

export default dismissnotification;
