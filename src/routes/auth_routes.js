// // a test not confident it will work
// import { auth,  checkUserType } from '../auth.js'
// import { Router } from 'express' 

// const secret = process.env.JWT_SECRET
// import { verifyToken } from '../auth.js'

// import jwt from 'jsonwebtoken'
// const { verify } = jwt

// import bcrypt from 'bcrypt'

// const router = Router()




// import User from '../models/user.js'
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { auth, verifyToken } = require('../auth.js');
const User = require('../models/user.js');
require('dotenv').config();

const router = Router();
const secret = process.env.JWT_SECRET;

// Login
router.post('/login', async (req, res) => {
    try {
        // Find the user with the provided email
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            // Validate the password
            const match = await bcrypt.compare(req.body.password || '', user.password)
            if (match) {
                // Generate a JWT and send it to the client
                const token = jwt.sign({
                    email: user.email,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
                }, secret)
                res.send({ token, email: user.email, accountType: user.accountType})
            } else {
                res.status(404).send({ error: 'Email or password incorrect' })
            }
        } else {
            res.status(404).send({ error: 'Email or password incorrect' })
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message })
    }
})

// router.post('/register', auth, verifyToken, async (req, res) => {
router.post('/register', async (req, res) => {
    try {
        // Create and save new User instance
        let user; 

        // we check if the values are entered
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ error: 'Email and password are required' })
        }

        // now we check user type then create the user
         user = await User.create({
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                userType: 'user'
            })
            // Send user to the client with 201 status

    
        // Send user to the client with 201 status
        // TODO: Create a JWT so the user is automatically logged in
        res.status(201).send({ email: user.email, accountType: user.accountType })
    
    }catch (err) {
        res.status(400).send({ error: err.message })
    }

})

// export default router;
module.exports = router;