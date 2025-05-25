// this is the auth middle were 
// will check if a user is of type admin or user

const { expressjwt } = require('express-jwt');
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET

// auth middleware function auth takes in params of req, rest, next
function auth(req, res, next) {
  return expressjwt({ secret, algorithms: ["HS256"] })(req, res, next);
}

// Verifies if the token is valid for the user
function verifyToken(req, res, next) { 
  try {
    const token = req.headers['authorization'];
    console.log('Authorization header:', token); //for debug
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

        const stripBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
        console.log('Token after Bearer removed:', stripBearer); //for debug

        jwt.verify(stripBearer, secret, (err, decoded) => {
            if (err) {
                console.log('JWT verify error:', err); // for debug
                return res.status(403).send({ error: 'Forbidden' });
            }
            console.log('DECODED TOKEN:', decoded);// for debug
            req.auth = decoded;
            next();
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

// Check if user is 'admin' or just 'user'
function checkUserType(req, res, next) {
    try {
        if (req.auth) {
            User.findOne({ email: req.auth.email }).then(user => {
                if (user && user.accountType === 'admin') {
                    req.userType = 'admin';
                } else {
                    req.userType = 'user';
                }
                next();
            });
        } else {
            res.status(403).send({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Error checking user type:', error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}


// export default { auth, checkUserType, verifyToken}
module.exports = { auth, verifyToken, checkUserType };