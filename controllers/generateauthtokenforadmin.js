import pool from "../database/database.js";
import jwt from "jsonwebtoken";
async function generateauthtokenforadmin(req,res){

      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken){
        return res.status(401).json({message:"Unauthorized"});
      }
      const result = await pool.query("SELECT s.id, s.email FROM admins s JOIN refreshtokens r ON s.id = r.user_id WHERE r.tokens = $1;",[refreshToken]);
      if(result.rows.length === 0){
          return res.status(403).json({message:"Forbidden"});
      }else{
        const token = jwt.sign({id:result.rows[0].id,email:result.rows[0].email,role:"admin"},"secret",{expiresIn:'2h'})
        return res.json({token});
      }
      

}   

export default generateauthtokenforadmin;