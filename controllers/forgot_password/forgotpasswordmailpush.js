import e from "express";
import pool from "../../database/database.js";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";

async function forgotpasswordmailpush(req, res) {
  const { email } = req.body || {};
  //for handling empty email field
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  function generateRandomString(length = 10) {
    return randomstring.generate({
      length: length,
      charset: "alphanumeric!@#$%^&*()"
    });
  }


  //generating token
  var token;

  //checking if email is registered
  const fetchstudent = await pool.query("SELECT * FROM students WHERE email = $1", [email]);

  //if email not registered
  if (fetchstudent.rowCount == 0) {
    return res.json({ success: false, message: "Email not registered" });
  }

  //checking if a verification process is already ongoing
  const already = await pool.query("SELECT * FROM  emailverificationforgot WHERE email= $1", [email]);

  //if a verification process is already ongoing
  if (already.rowCount > 0) {
    const expired = already.rows[0].entire_expire;


    //if the previous verification process is still ongoing
    if (expired && expired > new Date()) {


      return res.json({ success: false, message: "A verification process is already ongoing. Please check your email or try again later." });
    }

    else {
      if (already.rows[0].verified) {


        const sequence = generateRandomString();
        token = jwt.sign({ email, sequence }, process.env.SECRET_KEY);
        const updateverified = await pool.query(
          `UPDATE emailverificationforgot 
   SET verified = $1, 
       step = '2', 
       token = $3, 
       entire_expire = NOW() + interval '10 minutes',
       sequence = $4
   WHERE email = $2`,
          [false, email, token, sequence]
        );

        return res.json({ success: true, message: "Verification is re initailized.", token: token });
      }

      else {
        const sequence = generateRandomString();
        token = jwt.sign({ email, sequence }, process.env.SECRET_KEY);
        const updatetoken = await pool.query("UPDATE emailverificationforgot SET step='2',  entire_expire = NOW() + interval '10 minutes',  sequence = $3 ,token=$2 WHERE email = $1", [email, token, sequence]);
        return res.json({ success: true, message: "Verification is pending ", token: token });
      }

    }

  }
  else {
    const sequence = generateRandomString();
    token = jwt.sign({ email, sequence }, process.env.SECRET_KEY);
    const pushtoken = await pool.query(
      `INSERT INTO emailverificationforgot 
   (email, token, step, verified, entire_expire,sequence) 
   VALUES ($1, $2, '2', $3, NOW() + interval '10 minutes',$4)`,
      [email, token, false, sequence]
    );

    return res.json({ success: true, message: "Verification process started.", token: token });

  }
}

export default forgotpasswordmailpush;
