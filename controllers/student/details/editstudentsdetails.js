import pool from "../../../database/database.js";

async function editstudentsdetails(req, res) {
  try {
    const data1 = req.body;
    let { id, token, ...data } = data1;

    if (!id && req.user) id = req.user.id;

    if (!id) {
      return res.status(400).json({ success: false, message: "Student ID is required", token });
    }

    // 🧹 Clean object (remove null/empty values)
    function cleanObject(obj) {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null && value !== "")
      );
    }

    const cleanedobject = cleanObject(data);

    if (Object.keys(cleanedobject).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update", token });
    }

    const keys = Object.keys(cleanedobject);
    const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE students SET ${setString} WHERE id = $${keys.length + 1}`;
    const values = Object.values(cleanedobject);
    values.push(id);

    console.log("Executing Query:", query);
    console.log("With Values:", values);

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Student not found", token });
    }

    res.json({ success: true, message: "Student updated successfully", token });
  } catch (error) {
    console.error("Error updating student:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the student",
      error: error.message, token
    });
  }
}

export default editstudentsdetails;
