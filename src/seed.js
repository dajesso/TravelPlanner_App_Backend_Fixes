// import db from './db.js'
// import User from "./models/user.js"
// import bcrypt from 'bcrypt'
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const db = require('./db.js');
const User = require('./models/user.js');


// import { connect, close } from './db.js'
// import db from './db.js'
// import Trip from './models/trip.js'
const Trip = require('./models/trip.js');
const Category = require('./models/category.js');
const Expense = require('./models/expense.js');
// import Category from './models/category.js'
// import Expense from './models/expense.js'


// Trip
const trips = [
  {
    location: 'New Caledonia',
    arrivalDate: '2025-04-01',
    departureDate: '2025-04-07'
//     totalExpense: 2000
  },
  {
    location: 'Fiji',
    arrivalDate: '2025-04-08',
    departureDate: '2025-04-15'
//     totalExpense: 1000
  },
  {
    location: 'Bali, Indonesia',
    arrivalDate: '2025-06-16',
    departureDate: '2025-06-20'
//     totalExpense: 1500
  }
];

const categories = [
  { name: 'Food' },
  { name: 'Transport' },
  { name: 'Accommodation' }
];

const expenses = [
  {
    amount: 100,
    description: 'Dinner'
  },
  {
    amount: 50,
    description: 'Taxi'
  }
];

// Seeding function
async function seed() {
  try{
    await db.connect();
    // Clear Existing Data
    await User.deleteMany();
    await Trip.deleteMany();
    await Category.deleteMany();
    await Expense.deleteMany();
    const users = [
      {
        email: 'jesso@jesso.me',
        password: await bcrypt.hash("password", 10),
        accountType: 'admin'
      },
      {
        email: 'felicis@jesso.me',
        password: await bcrypt.hash("felicis", 10),
        accountType: 'user'
      }
    ];

    
    // Create User
    // await User.create(users) //this execute the creation but do not store or reuse the created user documents afterward.
    const createdUsers = await User.create(users); // execute the creation and save the returned documents
    //(with _ids and other Mongo-generated fields) to createdUsers for later use.
    //we store it because we want to: link trips to a user
    
    //associate the trips with a user and initialize their total expenses.
    // this is a demo data which assign trips to the first user
    trips.forEach(trip => {
      trip.user = createdUsers[0]._id;
      trip.totalExpense = 0; // Will be updated later
    });
    const createdTrips = await Trip.create(trips); // execute the creation and save the returned documents
    

    // Assign user to each category
    categories.forEach(category => {
    category.user = createdUsers[0]._id;
    });
    // Create categories
    const createdCategories = await Category.create(categories);
    
    // Assign trip and category to each expense
    // seeding the first expense to the first trip
    expenses[0].trip = createdTrips[0]._id;
    // the first expense to the first category
    expenses[0].category = createdCategories[0]._id;
    //Second expense to the first trip
    expenses[1].trip = createdTrips[0]._id;
    //Second expense to second category
    expenses[1].category = createdCategories[1]._id;
    
    // Create Expense
    const createdExpenses = await Expense.create(expenses);
    
     // Recalculate totalExpense for each trip
    for (const trip of createdTrips) {
      const total = await Expense.aggregate([
        { $match: { trip: trip._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalExpense = total[0]?.total || 0;
      trip.totalExpense = totalExpense;
      await trip.save();
    }

    console.log('Database seeded successfully');
    
    
  } catch{
    console.error('Seeding error:', err);
  } finally {
    db.close();
  }
  
};

// db.connect()
// Delete all existing posts
// await User.deleteMany()
// Creates and saves to MongoDB a new Post for each document in posts array
// Before we do the next statement, we need to assign a category to each post,
// otherwise it will fail with a validation error, since category is required.
// await User.create(users)
// console.log('Users created')


// db.connect()

// Delete all existing trips
// await Trip.deleteMany()
// await Trip.create(trips)
// console.log('Database seeded')

// Trip = model('Trip', {
//     // COULD IT BE LET EMPTY OR IT SHOULD HAVE A VALUE
// })


// We still have a db connection open, so the script won't end
// So we need to close the connection once we're done with it
// db.close()

seed();