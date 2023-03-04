const jwt=require('jsonwebtoken')
const UserModel=require('../models/users')

async function verify_logged_in (req, res, next)  {
    try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
      if (!token) {
        return res.status(401).json({ 
          status: 'Fail', 
          message: 'You are not logged in! Please log in to continue.' 
        });
      }
      const decoded = await jwt.verify(token,"my-super-secret-am-israel");
      req.user = decoded;
      const currentUser = await UserModel.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({
          status: 'Fail',
          message: 'The user belonging to this token no longer exists.'
        })
      }
      next();
    } catch (err) {
      res.status(401).json({
        status: 'Fail',
        message: err.message
      });
    }
  };

  module.exports=verify_logged_in;
















// const jwt = require('jsonwebtoken');
// const config = require('config');
 
// module.exports = (req, res, next) => {
//   const token = req.header('x-auth-token');
//   if (!token) return res.status(401).send('Access denied. No token provided.');
 
//   try {
//     const decoded = jwt.verify(token, config.get('jwtKey'));
//     req.user = decoded;
//     next();
//   }
//   catch (ex) {
//     res.status(400).send('Invalid token.');
//   }
// }
// const crypto = require("../helper/crypto_helper");

// function verify_logged_in(req, res, next) {

//     // 1. Check if header containing the token exists (Header = "Authorization")
//     if (!req.headers.authorization) {
//         return res.status(401).send("You are not authorized to access this resource.");
//     }

//     // 2. Check if correctly structured token exists ("Bearer {token}")
//     const token = req.headers.authorization.split(" ")[1];
//     if (!token) {
//         return res.status(401).send("You are not authorized to access this resource.");
//     }

//     // 3. Check if Token is valid (using JWT). If all is well, 'next()'
//     crypto.jwtVerify(token, (err) => {
//         if (err)
//             return res.status(err.status).send(err.message);

//         next();
//     });
// }

// module.exports = verify_logged_in;