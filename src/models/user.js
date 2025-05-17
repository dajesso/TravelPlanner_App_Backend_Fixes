// Creates a user model for the database with the following fields:
// email, password, accountType
import { model } from 'mongoose'

const User = model('User', {
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
})

export default User