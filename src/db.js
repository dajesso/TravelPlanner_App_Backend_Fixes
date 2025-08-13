
// async function close() {
//   await mongoose.disconnect()
//   console.log(mongoose.connection.readyState == 0 ? 'Mongoose disconnected!' : 'Mongoose failed to disconnect!')
// }

// // Best practice export
// module.exports = { connect, close }

// Section to connect to the MongoDB Atlas

// unsure why this isn't working but this is a simple workaround.

const mongoose = require('mongoose');

const connect = async () => {
  try {
    console.log('Mongo URI:', process.env.MONGO_URI);
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

// we need the close function for the tests otherwise it runs forever.

const close = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection failed:', error.message);
  }
};

module.exports = { connect, close};
