// this is the auth middle were 
// will check if a user is of type admin or user

// import { expressjwt } from "express-jwt"
// import User from './models/user.js'
// import 'dotenv/config';
// import db from './db.js'
// import jwt from 'jsonwebtoken'
// const { verify } = jwt

const { expressjwt } = require('express-jwt');
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');
const { serverError, forbidden, unauthorized } = require('./utils/responses.js');
require('dotenv').config();

const secret = process.env.JWT_SECRET
// auth middleware function auth takes in params of req, rest, next

// export function auth(req, res, next) {
//     return expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] })(req, res, next)
// }
function auth(req, res, next) {
    return expressjwt({ secret, algorithms: ["HS256"] })(req, res, next);
}

// checkUserType function checks if the user is an admin or a regular user

// we verify the token

// export function verifyToken(req,res, next) { 
    

//     try{

//     const token = req.headers['authorization']
    
//     const stripBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

//     if (!token) {
//         return res.status(401).send({ error: 'Unauthorized' })
//     }
//     jwt.verify(stripBearer, secret, (err, decoded) => {
//         if (err) {
//             return res.status(403).send({ error: 'Forbidden' })
//         }
//         req.auth = decoded
//         next()
//     })
//     }catch (error) {        
//         console.error('Error verifying token:', error)
//         return res.status(500).send({ error: 'Internal Server Error' })
//     }
// }
function verifyToken(req, res, next) { 
    try {
        const token = req.headers['authorization'];
        console.log('Authorization header:', token); //for debug
        if (!token) {
            unauthorized('Unauthorized');
        }

        const stripBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
        console.log('Token after Bearer removed:', stripBearer); //for debug

        jwt.verify(stripBearer, secret, (err, decoded) => {
            if (err) {
                console.log('JWT verify error:', err); // for debug
                forbidden(res, 'Forbidden');
            }
            req.auth = decoded;
            next();
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        serverError(res,  'Internal Server Error' );
    }
};


// export function checkUserType(req, res, next) {

//     try{
//     if (req.auth) {

//         // finds by the email then returns if its a user or admin
//         // we use the findOne method to find the user by email

//         User.findOne({ email: req.auth.email }).then(user => {
//             if (user && user.accountType === 'admin') {
//                 req.userType = 'admin'
//                 //res.status(200).send({ message: 'Authenticated Admin' })
//             } else {
//                 //res.status(200).send({ message: 'Authenticated User' })
//                 req.userType = 'user'
//             }
//             next()
//         })
//     } else {
//         res.status(403).send({ error: 'Unauthorized' })
//     }
//     }catch(error) {
//         console.error('Error checking user type:', error)
//         return res.status(500).send({ error: 'Internal Server Error' })
//     }
// }
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
            unauthorized('Unauthorized');
        }
    } catch (error) {
        console.error('Error checking user type:', error);
         serverError(res,  'Internal Server Error' );
    }
}




// export default { auth, checkUserType, verifyToken}
module.exports = { auth, verifyToken, checkUserType };