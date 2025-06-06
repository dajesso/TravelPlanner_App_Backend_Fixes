// import mongoose from 'mongoose'
const mongoose = require('mongoose');

// Section to connect to the database locally

// // Connect to MongoDB
// async function connect() {
// await mongoose.connect('mongodb://127.0.0.1:27017/travelp') // CHOOSE DB NAME
// console.log(mongoose.connection.readyState == 1 ? 'Mongoose connected' : 'Mongoose failed to connect!')
// }

// // Disconnect from MongoDB

// async function close() {
//   await mongoose.disconnect()
//   console.log(mongoose.connection.readyState == 0 ? 'Mongoose disconnected!' : 'Mongoose failed to disconnect!')
// }

// // Best practice export
// module.exports = { connect, close }

// Section to connect to the MongoDB Atlas

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { connect };



