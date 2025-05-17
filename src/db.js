import mongoose from 'mongoose'

// Connect to MongoDB
export async function connect() {
    await mongoose.connect('mongodb://127.0.0.1:27017/nodeintro_db')
    console.log(mongoose.connection.readyState == 1 ? 'Mongoose connected' : 'Mongoose failed to connect!')
}

// Named export
// JS will automagically export it wrapped in an object
// { close: close }
// ... where the value is the function itself
export async function close() {
    await mongoose.disconnect()
    console.log(mongoose.connection.readyState == 0 ? 'Mongoose disconnected!' : 'Mongoose failed to disconnect!')
}

// Best practice export
export default { connect, close }