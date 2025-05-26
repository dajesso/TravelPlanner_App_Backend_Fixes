// this is the auth middle ware 
// will check if a user is of type admin or user




const { expressjwt } = require('express-jwt');
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');
const { serverError, forbidden, unauthorized } = require('./utils/responses.js');
require('dotenv').config();

/** 
 Store a key word in '.env' to verify tokens, and it should be defined by each person that installs the app in their local machine
*/ 
const secret = process.env.JWT_SECRET

// Middleware that uses express-jwt to verify auth token
function auth(req, res, next) {
  return expressjwt({ secret, algorithms: ["HS256"] })(req, res, next);
}

// Verifies if the token is valid for the user
function verifyToken(req, res, next) { 
    try {
        // grab the token from the 'Authorization' header eg. from Bruno
      const token = req.headers['authorization'];
      console.log('Authorization header:', token); //for debug
       // No token, return a nice 'Unauthorized'
      if (!token) {
          return unauthorized(res, 'Unauthorized');
      }

    // Cuts off 'Bearer' from the 'value' field in the Header
    const stripBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
      console.log('Token after Bearer removed:', stripBearer); //for debugging

    // Decoding the token  
    jwt.verify(stripBearer, secret, (err, decoded) => {
    if (err) {
      console.log('JWT verify error:', err); // for debugging
        return res.status(403).send({ error: 'Forbidden' });
    }
      console.log('DECODED TOKEN:', decoded);// for debugging

      // Stores decoded token for use throughout app
      req.auth = decoded;
        next();
    });
    } catch (error) {
        console.error('Error verifying token:', error);
        serverError(res,  'Internal Server Error' );
    }
};

// Check if user is 'admin' or 'user'
function checkUserType(req, res, next) {
  try {
    if (req.auth) {

      // Find user in DB with email from the JWT  
      User.findOne({ email: req.auth.email }).then(user => {

        // Identify user as 'admin' or 'user'
        if (user && user.accountType === 'admin') {
          req.userType = 'admin';
        } else {
          req.userType = 'user';
        }
    next();
    });
        // Prompts nice message if the user is not authorized
        } else {
          // export default { auth, checkUserType, verifyToken}
          return unauthorized(res, 'Unauthorized');
        }
    } catch (error) {
        console.error('Error checking user type:', error);
         serverError(res,  'Internal Server Error' );
    }
}

module.exports = { auth, verifyToken, checkUserType };