import express from 'express';;
import mongoose from 'mongoose';
import expense_routes from './routes/expense_routes.js';


const app = express();
const port = 3000;
// insert middleware to insert json body
app.use(express.json());
// app.use inserts middleware into the request-reponse cycle
app.use(expense_routes);

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  // Connect to MongoDB;
  await mongoose.connect('mongodb://127.0.0.1:27017/travelplanner')
  console.log(mongoose.connection.readyState ==1 ? 'Mongoose connected' : 'Mongoose failed');

});