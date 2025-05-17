// a test not confident it will work
import { auth,  checkUserType } from '../auth.js'
import { Router } from 'express' 
import jwt from 'jsonwebtoken'
const secret = process.env.JWT_SECRET

import bcrypt from 'bcrypt'

const router = Router()




import User from '../models/user.js'

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
                res.send({ token, email: user.email })
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

router.post('/register', auth, checkUserType, async (req, res) => {
    try {
        // Create and save new User instance

        // now we check user type then create the user

        // we need to check for the token.
    
        if (req.userType === 'admin') {
            // check if the user is an admin
            // then we create the user
            const user = await User.create({
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                accountType: 'user'
            })
        }else{
            res.status(403).send({ error: 'Unauthorized' })
        }
            // Send user to the client with 201 status

    
        // Send user to the client with 201 status
        // TODO: Create a JWT so the user is automatically logged in
        res.status(201).send({ email: user.email })
    
    }catch (err) {
        res.status(400).send({ error: err.message })
    }

})

export default router;