import mongoose from 'mongoose'

// Connect to MongoDB
export async function connect() {
await mongoose.connect('mongodb://127.0.0.1:27017/travelp') // CHOOSE DB NAME
console.log(mongoose.connection.readyState == 1 ? 'Mongoose connected' : 'Mongoose failed to connect!')
}

// Disconnect from MongoDB
export async function close() {
  await mongoose.disconnect()
  console.log(mongoose.connection.readyState == 0 ? 'Mongoose disconnected!' : 'Mongoose failed to disconnect!')
}

export default { connect, close }


