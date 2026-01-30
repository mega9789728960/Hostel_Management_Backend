import pool from "../../../database/database.js";

async function fetchNotificationForStudents(req, res) {
    try {

        req.body.student_id = req.body.id;
        let { student_id } = req.body;

        if (!student_id && req.user) student_id = req.user.id;

        if (!student_id) {
            return res.status(400).json({ success: false, message: "Student ID is required" });
        }

        const query = `
            SELECT 
                sd.id AS notification_id,
                sd.dismiss,
                sd.created_at AS notification_created_at,
                a.id AS announcement_id,
                a.title,
                a.message,
                a.priority,
                a.scheduled_date
            FROM students_dashboard_notifications sd
            INNER JOIN annocements a ON sd.announcement_id = a.id
            WHERE sd.student_id = $1
              AND sd.dismiss = false
            ORDER BY sd.created_at DESC
        `;

        const result = await pool.query(query, [student_id]);

        return res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export default fetchNotificationForStudents;
