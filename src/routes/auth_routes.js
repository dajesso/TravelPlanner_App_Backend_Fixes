const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { auth, verifyToken } = require('../auth.js');
const User = require('../models/user.js');
const { seedCategoriesForUser } = require('../utils/seedCategory.js');
require('dotenv').config();

const router = Router();
const secret = process.env.JWT_SECRET;


const {badRequest, goodRequest, notFound} = require('../utils/responses.js')

// Login route
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
                     _id: user._id,
                    email: user.email,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
                }, secret);

                // Seed fixed categories after login
                await seedCategoriesForUser(user._id);

                res.send({ token, email: user.email, accountType: user.accountType});
                //Error handling in case that the password is incorrect
            } else {

                notFound(res, 'Email or password incorrect');
            }
            // Error handling in case that the email does not exist
        } else {
            notFound(res, 'Email or password incorrect');

        }
    } 
    catch (err) {
         badRequest(res, err.message);
    }
});



router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return badRequest(res, 'Email and password are required');
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return badRequest(res, 'Email is already registered');
    }

    // Create new user
    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      userType: 'user',
    });

    // Send successful response
    return goodRequest(res, user.email, user.userType, 'User created successfully');

  } catch (err) {
    return badRequest(res, err.message);
  }
});

module.exports = router;