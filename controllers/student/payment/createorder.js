import pool from "../../../database/database.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";

// 🏦 Cashfree configuration (Sandbox mode)
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.APP_ID,
  process.env.PAYMENT_KEY

);

// 🔢 Generate unique order_id (student_id + year_month + timestamp)
function generateOrderId(student_id, year_month) {
  const timestamp = Date.now();
  return `${student_id}_${year_month}_${timestamp}`;
}

// ⚙️ Create Order API
async function createorder(req, res) {
  try {
    const { student_id, year_month, student_name, student_email, student_phone } = req.body;

    // 🚫 Validation
    if (!student_id || !year_month) {
      return res.status(400).json({ error: "student_id and year_month are required" });
    }

    // 1️⃣ Fetch bill and cost details
    const billQuery = await pool.query(
      `
      SELECT 
        mb.id AS bill_id,
        mb.status,
        mb.number_of_days,
        mb.isveg,
        mb.veg_days,
        mb.non_veg_days,
        mb.ispaid,
        mbd.mess_fee_per_day,
        mbd.veg_extra_per_day,
        mbd.nonveg_extra_per_day
      FROM mess_bill_for_students mb
      INNER JOIN monthly_base_costs mbd
        ON mb.monthly_base_cost_id = mbd.id
      WHERE mb.student_id = $1 
        AND mbd.month_year = $2
      `,
      [student_id, year_month]
    );

    if (billQuery.rows.length === 0) {
      return res.status(404).json({ error: "Bill not found for this student and month" });
    }

    const bill = billQuery.rows[0];

    // 2️⃣ Prevent re-payment if already SUCCESS
    if (bill.ispaid) {
      return res.status(400).json({ error: "Payment already completed for this month." });
    }

    // 3️⃣ Calculate total amount dynamically based on isveg
    const mess_fee_per_day = Number(bill.mess_fee_per_day) || 0;
    const veg_extra_per_day = Number(bill.veg_extra_per_day) || 0;
    const nonveg_extra_per_day = Number(bill.nonveg_extra_per_day) || 0;
    const number_of_days = Number(bill.number_of_days) || 30;
    const veg_days = Number(bill.veg_days) || 0;
    const non_veg_days = Number(bill.non_veg_days) || 0;

    let total_amount = 0;

    // 🧮 Total Calculation Logic
    if (bill.isveg === true) {
      // Veg case
      total_amount =
        veg_days * veg_extra_per_day + number_of_days * mess_fee_per_day;
    } else if (bill.isveg === false) {
      // Non-veg case
      total_amount =
        non_veg_days * nonveg_extra_per_day + number_of_days * mess_fee_per_day;
    } else {
      // Default (no preference)
      total_amount = number_of_days * mess_fee_per_day;
    }

    // 4️⃣ Generate unique order_id
    const orderId = generateOrderId(student_id, year_month);

    // 5️⃣ Prepare Cashfree order request
    const request = {
      order_amount: total_amount > 0 ? total_amount : 1, // fallback to 1
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: student_id,
        customer_name: student_name || "Student Name",
        customer_email: student_email || "example@gmail.com",
        customer_phone: student_phone || "9999999999",
      },
      order_note: `Mess bill for ${year_month}`,
      order_meta: {
        notify_url: "https://finalbackend1.vercel.app/webhook/",
        return_url: "https://chozha-boys-hostel-management-syste.vercel.app/dashboard"
      },
      order_tags: {
        student_id: student_id,
        mess_bill_id: bill.bill_id,
      },
    };

    // 6️⃣ Create order on Cashfree
    const response = await cashfree.PGCreateOrder(request);

    // 7️⃣ Update latest_order_id in DB
    await pool.query(
      `
      UPDATE mess_bill_for_students 
      SET latest_order_id = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [response.data.cf_order_id, bill.bill_id]
    );

    console.log("✅ Cashfree order created:", response.data);

    // ✅ Response to frontend
    res.json({
      message: "Order created successfully",
      total_amount,
      cashfree_response: response.data,
    });

  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default createorder;
