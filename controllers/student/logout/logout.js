import pool from "../../../database/database.js";
import redis from "../../../database/redis.js";

async function studentLogout(req, res) {
    try {
        if (!req.user || String(req.user.id) !== String(req.body.user_id)) {
            return res.status(403).json({ success: false, error: "Unauthorized: User ID mismatch" });
        }

        const refreshToken = req.cookies.refreshToken;
        const studentToken = req.cookies.studentToken || req.headers["authorization"]?.split(" ")[1];



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
            const result = await pool.query("DELETE FROM refreshtokens WHERE tokens = $1 AND role = 'student' RETURNING id, user_id", [refreshToken]);

            if (result.rows.length > 0) {
                const { id, user_id } = result.rows[0];
                const userResult = await pool.query("SELECT email FROM students WHERE id = $1", [user_id]);
                if (userResult.rows.length > 0) {
                    const email = userResult.rows[0].email;
                    // Key: revoked_token:{id}, Value: JSON of user_id, email
                    await redis.set(`revoked_token:${id}`, JSON.stringify({ user_id, email, role: 'student' }), { ex: 7 * 24 * 60 * 60 });
                }
            }
        }

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

export default studentLogout;
