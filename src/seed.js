import db from './db.js'
import User from "./models/user.js"
import bcrypt from 'bcrypt'

// create the users for the database. we have two user types admin and user.

const users = [
    {
        email: 'jesso@jesso.me',
        // we hash the password before we save it to the database
        password: await bcrypt.hash("password", 10),
        accountType: 'admin'
    },
    {
        email: 'felicis@jesso.me',
        // we hash the password before we save it to the database
        password: await bcrypt.hash("felicis", 10),
        accountType: 'user'
    }
]
db.connect()
// Delete all existing posts
await User.deleteMany()
// Creates and saves to MongoDB a new Post for each document in posts array
// Before we do the next statement, we need to assign a category to each post,
// otherwise it will fail with a validation error, since category is required.
await User.create(users)
console.log('Users created')

// We still have a db connection open, so the script won't end
// So we need to close the connection once we're done with it
db.close()