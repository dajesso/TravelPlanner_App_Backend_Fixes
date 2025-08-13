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
async function verifyToken(req, res, next) { // BUG FIX 1: Added async
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

    // BUG FIX 2: Use stripBearer instead of token
    const decoded = jwt.verify(stripBearer, process.env.JWT_SECRET);

    // check the database user.
    const checkUser = await User.findById(decoded.userId);
    if (!checkUser) {
      // BUG FIX 3: Fixed typo badReuqest -> unauthorized
      return unauthorized(res, "Invalid token - user doesn't exist in database");
    }

    // add user userID, email and account type
     req.user = {
      userId: checkUser._id,
      email: checkUser.email,
      accountType: checkUser.accountType
    };

    next();

  }catch(error){
    // we now check the error and display the right one.
    if (error.name === 'JsonWebTokenError') {
      // BUG FIX 4: Fixed typo Invaild -> Invalid
      return forbidden(res, "Invalid Token");
    }
    if (error.name === 'TokenExpiredError') {
      return forbidden(res, 'Token expired');
    }
    return serverError(res, 'Token verification failed');
  }
}

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
          return unauthorized(res, 'Unauthorized');
        }
    } catch (error) {
        console.error('Error checking user type:', error);
        // BUG FIX 5: Added missing return statement
        return serverError(res, 'Internal Server Error');
    }
}

module.exports = { auth, verifyToken, checkUserType };