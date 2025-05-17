// this is the auth middle were 
// will check if a user is of type admin or user

import { expressjwt } from "express-jwt"
import User from './models/user.js'
import 'dotenv/config';
import db from './db.js'
const secret = process.env.JWT_SECRET
// auth middleware function auth takes in params of req, rest, next

export function auth(req, res, next) {
    return expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] })(req, res, next)
}
// checkUserType function checks if the user is an admin or a regular user


export function checkUserType(req, res, next) {
    if (req.auth) {

        // finds by the email then returns if its a user or admin
        // we use the findOne method to find the user by email

        User.findOne({ email: req.auth.email }).then(user => {
            if (user && user.accountType === 'admin') {
                req.userType = 'admin'
                //res.status(200).send({ message: 'Authenticated Admin' })
            } else {
                //res.status(200).send({ message: 'Authenticated User' })
                req.userType = 'user'
            }
            next()
        })
    } else {
        res.status(403).send({ error: 'Unauthorized' })
    }
}

export default { auth, checkUserType }