const request = require('supertest');
const app = require('../src/index.js')

let token = ''; 
let tripId = '';


// fixed the trip_testing script so we needed to create a trip without a ID grab that id for testing the second issue
// was that we needed to make arrival date and depature date MM/DD/YYYY when creati


//Set up for test
beforeAll(async () => {
    // Login and get token
    const res = await request(app)
    .post('/login')
    .send({ email: 'jesso@jesso.me', password: 'password' });

    //get the token
    token = res.body.token;


    // Create a trip and store its ID for testing
    const tripRes = await request(app)
    .post('/trips')
    .set('Authorization', `Bearer ${token}`)
    .send({
        location: 'Test City',
        arrivalDate: "08/09/1997",
        departureDate: "09/09/2025",
    });
    tripId = tripRes.body._id;
});

// Testing



describe("Get one trip and return the check _id, location, arrivalDate, departureDate, and totalExpense", () => {
    it("should return one trip with its the correct keys.", async () => {


        const res = await request(app)
        .get(`/trips/${tripId}`)
        .set('Authorization', `Bearer ${token}`);
    
        // must be 200 OK otherwise the test will fail
        expect(res.statusCode).toBe(200);

        // check the body for the correct properties
    
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('location');
        expect(res.body).toHaveProperty('arrivalDate');
        expect(res.body).toHaveProperty('departureDate');
        expect(res.body).toHaveProperty('totalExpense');
    });
});

describe("Check if login is successfull", () => {
    it("should return a token and user email", async () => {
        const res = await request(app)
        .post('/login')
        .send({ email: 'jesso@jesso.me', password: 'password' });
        // must be 200 OK otherwise the test will fail
        expect(res.statusCode).toBe(200);
    });
  });

  // now to check if the ID exists in the database

describe("Check if trip ID exists in the database", () => {
    it("should return a trip with the given ID", async () => {

        
        
        const res = await request(app)
        .get(`/trips/${tripId}`)
        .set('Authorization', `Bearer ${token}`);
        
        
        // must be 200 OK otherwise the test will fail
        expect(res.statusCode).toBe(200);
        
        // check if the trip ID matches the one we created
        expect(res.body._id).toBe(tripId);
    });

});