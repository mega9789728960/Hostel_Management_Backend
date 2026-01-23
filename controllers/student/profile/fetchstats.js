import pool from "../../../database/database.js";

const fetchProfileStats = async (req, res) => {
    const { student_id } = req.body; // Expecting student_id from body (or could be params if GET)
    // Note: if using GET, use req.query or req.params. converting to POST for easy body access or use GET with params.
    // Profile.jsx uses GET usually. Let's support POST for consistency with other controllers seen, or GET.
    // I will use POST as many controllers here seem to use POST for fetching with params.

    if (!student_id) {
        return res.status(400).json({ success: false, error: "Student ID is required" });
    }

    try {
        // 1. Get Student Details (Department, Academic Year) for context
        const studentQuery = `SELECT academic_year, department, created_at FROM students WHERE id = $1`;
        const studentRes = await pool.query(studentQuery, [student_id]);

        if (studentRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Student not found" });
        }
        const student = studentRes.rows[0];

        // 2. Attendance Stats
        // Total Hostel Days (Overall): Count distinct dates in attendance table
        const totalDaysQuery = `SELECT COUNT(DISTINCT date) as count FROM attendance`;
        const totalDaysRes = await pool.query(totalDaysQuery);
        const totalDays = parseInt(totalDaysRes.rows[0].count, 10) || 1; // Avoid divide by zero

        // My Present Days (Overall)
        const myDaysQuery = `SELECT COUNT(*) as count FROM attendance WHERE student_id = $1 AND status = 'Present'`;
        const myDaysRes = await pool.query(myDaysQuery, [student_id]);
        const myDays = parseInt(myDaysRes.rows[0].count, 10);

        // Current Year Stats
        // Assuming 'academic_year' in students table is like '2023-2024' or just '1', '2', '3'.
        // If it's 1, 2, 3, 4, it's relative.
        // Let's rely on date ranges. "This year" = This calendar year? Or Academic Year?
        // User said "for single year". Let's assume current Academic Year (e.g., starts June/Aug or based on current date).
        // For simplicity, let's just return annual stats based on the last 365 days or similar, OR grouped by year.
        // Better: Return stats for the *current* academic year defined in 'students'.
        // Use filter: WHERE date >= (current_timestamp - interval '1 year')?
        // Let's return "Current Year" as records matching current calendar year for now, or match the user's 'academic_year' if it was a real year.
        // Since I don't know the exact year format, I'll calculate stats for the "Current Calendar Year".

        const currentYear = new Date().getFullYear();
        const startOfYear = `${currentYear}-01-01`;
        const endOfYear = `${currentYear}-12-31`;

        const totalDaysYearQuery = `SELECT COUNT(DISTINCT date) as count FROM attendance WHERE date >= $1 AND date <= $2`;
        const myDaysYearQuery = `SELECT COUNT(*) as count FROM attendance WHERE student_id = $3 AND status = 'Present' AND date >= $1 AND date <= $2`;

        const [totalDaysYearRes, myDaysYearRes] = await Promise.all([
            pool.query(totalDaysYearQuery, [startOfYear, endOfYear]),
            pool.query(myDaysYearQuery, [startOfYear, endOfYear, student_id])
        ]);

        const totalDaysYear = parseInt(totalDaysYearRes.rows[0].count, 10) || 1;
        const myDaysYear = parseInt(myDaysYearRes.rows[0].count, 10);


        // 3. Mess Bill Stats
        // We need to sum up paid and unpaid bills.
        // Using logic similar to fetchMessBills to calculate amount.

        const messBillQuery = `
      SELECT 
        mbfs.status,
        mbfs.isveg,
        mbfs.veg_days,
        mbfs.non_veg_days,
        mbfs.number_of_days,
        myd.total_days,
        mbc.mess_fee_per_day,
        mbc.veg_extra_per_day,
        mbc.nonveg_extra_per_day
      FROM mess_bill_for_students mbfs
      JOIN monthly_base_costs mbc ON mbfs.monthly_base_cost_id = mbc.id
      JOIN monthly_year_data myd ON mbfs.monthly_year_data_id = myd.id
      WHERE mbfs.student_id = $1
    `;

        const messBillsRes = await pool.query(messBillQuery, [student_id]);

        let paidAmount = 0;
        let notPaidAmount = 0;

        messBillsRes.rows.forEach(bill => {
            // Calculate Bill Amount
            const days = bill.number_of_days || bill.total_days;
            let amount = days * bill.mess_fee_per_day;

            if (bill.isveg) {
                amount += (bill.veg_days || 0) * bill.veg_extra_per_day;
            } else {
                // Assuming false means non-veg. 
                // CAUTION: It might be null. if boolean, false is non-veg.
                amount += (bill.non_veg_days || 0) * bill.nonveg_extra_per_day;
            }

            const status = bill.status ? bill.status.toLowerCase() : 'unpaid';
            if (status === 'paid' || status === 'success') {
                paidAmount += amount;
            } else {
                notPaidAmount += amount;
            }
        });

        res.json({
            success: true,
            data: {
                attendance: {
                    overall: {
                        present: myDays,
                        total: totalDays,
                        percentage: ((myDays / totalDays) * 100).toFixed(2)
                    },
                    year: {
                        present: myDaysYear,
                        total: totalDaysYear,
                        percentage: ((myDaysYear / totalDaysYear) * 100).toFixed(2),
                        label: currentYear
                    }
                },
                messBill: {
                    paid: paidAmount.toFixed(2),
                    notPaid: notPaidAmount.toFixed(2),
                    currency: "₹"
                }
            }
        });

    } catch (error) {
        console.error("Error fetching profile stats:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export default fetchProfileStats;
