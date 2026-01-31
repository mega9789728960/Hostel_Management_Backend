import pool from "./database/database.js";

async function checkRefreshtokens() {
    try {
        const res = await pool.query(`
      SELECT id, user_id, role, device_info, created_at 
      FROM public.refreshtokens 
      ORDER BY created_at DESC 
      LIMIT 5;
    `);

        console.log("Latest 5 Refresh Tokens:");
        console.table(res.rows.map(row => ({
            id: row.id,
            user_id: row.user_id,
            role: row.role,
            device_info_present: !!row.device_info,
            device_info_preview: row.device_info ? JSON.stringify(row.device_info).substring(0, 50) + "..." : "NULL",
            created_at: row.created_at
        })));

    } catch (err) {
        console.error("Error querying database:", err);
    } finally {
        await pool.end();
    }
}

checkRefreshtokens();
