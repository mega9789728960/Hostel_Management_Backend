import pool from "../../../database/database.js";
import bcrypt from "bcrypt";

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const { email } = req.user; // Captured from studentauth middleware

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.json({ success: false, message: "New passwords do not match" });
        }

        const userResult = await pool.query("SELECT * FROM students WHERE email = $1", [email]);

        if (userResult.rows.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }

        const user = userResult.rows[0];

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect current password" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        await pool.query("UPDATE students SET password = $1 WHERE email = $2", [hashedPassword, email]);

        return res.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error("Change Password Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default changePassword;
