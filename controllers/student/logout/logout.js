import pool from "../../../database/database.js";

async function studentLogout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        // Clear cookies
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.clearCookie("studentToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        if (refreshToken) {
            // Remove refresh token from database
            await pool.query("DELETE FROM refreshtokens WHERE tokens = $1 AND role = 'student'", [refreshToken]);
        }

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

export default studentLogout;
