import jwt from "jsonwebtoken";


async function studentauth(req, res, next) {
   // 1️⃣ Get tokens
   const token = req.body.token || req.headers["authorization"]?.split(" ")[1];
   if(!token){
     res.json({message: 'No token provided'});
   }
   try {
     // 2️⃣ Verify access token
     const decoded =  jwt.verify(token, process.env.SECRET_KEY);
     if(decoded.role !="student"){
      return res.json({"message":"you are not a student"})
     }
     next();
 
 }
 catch (err) {
  console.error(err);
     res.status(401).json({
       message: err.message,
     });   }
}

export default studentauth;
