
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('./db.js');
const User = require('./models/user.js');
const Trip = require('./models/trip.js');
const Category = require('./models/category.js');
const Expense = require('./models/expense.js');

// Trip
const trips = [
  {
    location: 'New Caledonia',
    arrivalDate: '2025-04-01',
    departureDate: '2025-04-07'
  },
  {
    location: 'Fiji',
    arrivalDate: '2025-04-08',
    departureDate: '2025-04-15'
  },
  {
    location: 'Bali, Indonesia',
    arrivalDate: '2025-06-16',
    departureDate: '2025-06-20'
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

// Seeding function, stores intial information into the DB to run tests
async function seed() {
  try{
    await db.connect();
    // Delete any existing data
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
    /** Creates and saves the returned documents with '_id', 
    and other Mongo-generated fields, to 'createUsers' 
    for later use. We store it to link 'trips' to the specific 'user'. 
    */
    const createdUsers = await User.create(users);
    
    //associate the trips with a user and initialize their total expenses.
    // this is a demo data which assign trips to the first user
    trips.forEach(trip => {
      trip.userId = createdUsers[0]._id;
      trip.totalExpense = 0; // Will be updated later
    });
    // execute the creation and save the returned documents
    const createdTrips = await Trip.create(trips); 
    

    // Assign user to each category
    categories.forEach(category => {
    category.user = createdUsers[0]._id;
    });
    // Create categories
    const createdCategories = await Category.create(categories);
    
    
    /**  Assign trip and category to each expense
    seeding the first expense to the first trip
    */
    expenses[0].trip = createdTrips[0]._id;

    // the first expense to the first category
    expenses[0].category = createdCategories[0]._id;

    //Second expense to the first trip
    expenses[1].trip = createdTrips[0]._id;
    
    //Second expense to second category
    expenses[1].category = createdCategories[1]._id;
    
    // Create Expense
    // const createdExpenses = await Expense.create(expenses);
    
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
    
    
  } catch (err){
    console.error('Seeding error:', err);
  } finally {
    db.close();
  }
  
};

seed();