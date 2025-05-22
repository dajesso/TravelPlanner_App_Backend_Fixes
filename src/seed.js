// import { connect, close } from './db.js'
import db from './db.js'
import Trip from './models/trip.js'
// import Category from './models/category.js'
// import Expense from './models/expense.js'

const trips = [
  {
    location: 'New Caledonia',
    arrivalDate: '2025-04-01',
    departureDate: '2025-04-07',
    totalExpense: 2000
  },
  {
    location: 'Fiji',
    arrivalDate: '2025-04-08',
    departureDate: '2025-04-15',
    totalExpense: 1000
  },
  {
    location: 'Bali, Indonesia',
    arrivalDate: '2025-06-16',
    departureDate: '2025-06-20',
    totalExpense: 1500
  }
]

db.connect()

// Delete all existing trips
await Trip.deleteMany()
await Trip.create(trips)
console.log('Database seeded')
db.close()

// Trip = model('Trip', {
//     // COULD IT BE LET EMPTY OR IT SHOULD HAVE A VALUE
// })