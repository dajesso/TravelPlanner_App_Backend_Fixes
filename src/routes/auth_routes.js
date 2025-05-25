const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { auth, verifyToken } = require('../auth.js');
const User = require('../models/user.js');
require('dotenv').config();

const router = Router();
const secret = process.env.JWT_SECRET;

// Login
/** TODO: handle error when trying to register an existing email
 * Trial produced this: 
 * "error": "E11000 duplicate key error collection: travelp.users index: email_1 dup key: { email: \"user.test@gmail.com\" }"
 * Handle with a meaningful response
*/
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
        }, secret)
        // Return token, email, an account type
        res.send({ token, email: user.email, accountType: user.accountType})

        //Error handling in case that the password is incorrect
      } else {
        res.status(404).send({ error: 'Email or password incorrect' })
      }
      // Error handling in case that the email does not exist
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
        // TODO: Create a JWT so the user is automatically logged in
        // ANGIE, ARE WE STILL THINKING ABOUT DOING THIS?
    res.status(201).send({ email: user.email, accountType: user.accountType });

  } catch (err) {
      res.status(400).send({ error: err.message });
    }
})

// export default router;
module.exports = router;