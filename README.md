# Diploma of Web Development at CoderAcademy - Cohort October 2024

## Assignment - Construct a Back-end Web Application

### 16020 - Tsai-Chi Yang
### 15524 - Hernan Velasquez
### 16011 - Jessica Amy

# 🌍 Travel Planner API

This is the backend server for the **Travel Planner App**, a full-stack MERN application that helps users manage their trips and travel expenses. The API allows users to securely create, update, and delete trips and related expenses, supporting features such as categories and expense totals.

---

## Features

-  **Authentication** with JWT
-  **Trip management** (create, update, delete, view)
-  **Expense tracking** per trip, including total calculations
-  **Categories** for organizing expenses
-  Clean, formatted date display with `moment.js`
-  Protected routes and error handling
-  Validation for inputs and graceful error feedback

## Getting Started

Follow these steps to get the backend server up and running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Angie-newbie/TravelPlanner_App_Backend.git
cd TravelPlanner_App_Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a .env File
In the root of the project, create a file named .env and add the following:
```bash
JWT_SECRET=felicisontheloose
```

### 4. Start MongoDB (if not already running)
If you're using a local MongoDB server, start it with:
```bash
mongod
```

### 5. Start the Server (Development Mode)
```bash
npm run dev
```
You should see output confirming the server and database connection:
```bash
Server running on http://localhost:3000
Connected to MongoDB
```

### API Endpoints
---
#### Users | | Register, login and auth

- ```POST /register``` ---> Register a new user
- ```POST /login``` ---> Login of registered user

Once the user is authenticated with the correct user-password pair, the user can perform:

#### Trips | | CRUD operations

- ```POST /trips``` ---> Create a new trip 
- ```GET /trips``` ---> Get all trips 
- ```GET /trips/:id``` ---> Get one specific trip 
- ```PATCH /trips/:id``` ---> Modify values of one specific trip 
- ```DELETE /trips/:id``` ---> Delete one specific trip

#### Categories | | CRUD operations

- ```POST /categories``` ---> Create a new category 
- ```GET /categories``` ---> Get all categories 
- ```GET /categories/:id``` ---> Get one specific category 
- ```PATCH /categories/:id``` ---> Modify one category
- ```DELETE /categories/:id``` ---> Delete one category

#### Expenses | | CRUD operations

- ```POST /expenses``` ---> Create a new expense 
- ```GET /expenses``` ---> Get all expenses 
- ```GET /expenses/:id``` ---> Get one specific expense 
- ```PATCH /expenses/:id``` ---> Modify values of one specific expense 
- ```DELETE /expenses/:id``` ---> Delete one specific expense

### Style Guide for the code

The code of the Travel Planner Web Application is written following the **Airbnb JavaScript Style Guide**(Airbnb, 2025)[^1], to facilitate readability, safe JavaScript practices, and seamless interaction among coders that might want to inspect this source in the future.

### Dependent software and packages

To support the core functionality and enhance development efficiency, the app relies on the following key software dependencies and packages:

#### Mongoose
Object Data Modelling (ODM) library to work with MongoDB and Node.js. It works as a link between the MongoDB database and Node.js, allowing the creation of models to interact with the database through JavaScript objects (Automattic, 2025)[^2].
#### Express.Js
A backend framework that facilitates routing using HTTP requests and provides middleware functions to sustain the request-response cycle. Express.js uses functions that can modify requests and response objects, terminate the request-response cycle, and call the next function in the stack (MDN web docs, 2025)[^3].
#### JSON Web Token
This is a Node.js library that uses the JSON Web Token (JWT), a method to create, verify and decode information shared between two parties. It allows for a secure route, avoiding unwanted entities from accessing the user's information (Geeks for Geeks, 2025)[^4].
#### Bcrypt
Package with a password-hashing function that masks a user's password in a random sequence of letters and numbers. This is a one-way hashing function, which means it is computationally infeasible to reverse the hash back to the original password (Auth0, 2021)[^5].
#### Cors
According to MDN Web Docs (2025)[^CORS], ```cors``` package in Node.js + Express.js helps configure and respond with the adequate CORS headers in HTTP responses. These headers would pass the message to the web browser to allow web pages from other origins to access resources from the server.
#### Dotenv
Node.js package that enables the management of environment variables by loading them from a ```.env``` file. This practice avoids coders storing sensitive data in the codebase. This package allows different configurations for development, testing, and production environments (TeachmeJS, 2025)[^6].
#### Jest
Testing framework developed by Facebook, which is mainly used for testing React applications, but it is robust enough to be used with any JavaScript project. It is quite comprehensive while allows testing solutions with minimal setup, mocking functions and modules and code coverage reporting (jestjs, 2025)[^7].

### Minimal hardware required

According to the dependencies and packages used in this application, the minimal requirements for local development and lightweight testing are:

- CPU: with Dual-core processor (e.g., Intel i3 or equivalent ARM) (Node.js, 2025)[^8].
- RAM: 4 GB would be needed if MongoDB is local. Otherwise, 2GB of RAM will satisfy the requirements (MongoDB, 2025)[^9].
- Storage: 10 GB will comfortably handle MongoDB, logs and static files (MongooDB, 2025)[^9].
- OS: Windows 10+, macOS, or Linux

### Comparisons to alternative technologies

Other technologies which would also make this application possible are compared in the table below:

| **Stack**              | **Frontend**        | **Backend**       | **Database** | **Pros**                                                                             | **Cons**                                                  | **For you if...**                                       |
| ---------------------- | ------------------- | ----------------- | ------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------- |
| **MEVN**               | Vue.js              | Express.js + node | MongoDB      | Files size is small, uses HTML tags to build, and it is reactive                      | It gets less support from the React community             | JS is desired with less complexity                      |
| **Django + React**     | React               | Django (Python)   | PostgreSQL   | Built- in admin, auth, forms                                                         | Required knowledge of Python and JS                       | Robust backend is preferred                             |
| **Next.js + Prisma**   | Next.js (React SSR) | Node.js           | PostgreSQL   | Easily read by search engines and friendly DB interaction                            | It might be heavy for small apps                          | Full-stack with server-side rendering                   |
| **Flutter + Firebase** | Flutter (Dart)      | Firebase (BaaS)   | Firestore    | Cross-platform, real-time sync, no backend setup                                     | Subscription based, limited with complex DB relationships | Mobile support                                          |
| **Ruby on Rails**      | ERB/Hotwire         | Rails             | PostgreSQL   | Easy scaffolding, code generators, and pre-formed architecture to boost productivity | Less JS focus, older ecosystem                            | You want Minimum Viable Product fast with minimal setup |

Source for **MEVN** (State of JS, 2023)[^10]
Source for **Next.js + Prisma** (Prisma, 2025)[^11], (Heavy AI, 2024)[^12], (Cloudfare, 2025)
Source for **Flutter + Firebase** (FreeCodeCamp, 2020)[^13]
Source for **Django + React** (Geeks for Geeks, 2025)[^14]
Source for **Ruby on Rails** (Hotwire.dev, 2025)[^15]

### Licenses of chosen technologies

- MongoDB, Inc.'s *Server Side Public License* (MongoDB, 2025)[^16]
- Express.js is licensed under *MIT License* (Expressjs, 2015)[^17]
- Node.js *MIT License* (Nodejs, 2022)[^18]
- JSON Web Token is *MIT License* (node-jsonwebtoken, 2014)[^19]
- Bcrypt is *MIT License* (node.bcrypt.js, 2021)[^20]
- Dotenv is *MIT License* (dotenv, 2015)[^21]
- Jest is *MIT License* (jest, 2024)[^22]
- Cors is *MIT License* (NPM, 2018)[^23]

---
### References

[^1]: Airbnb, JavaScript 2025, *Airbnb JavaScript Style Guide*, accessed on 10 May 2025, https://github.com/airbnb/javascript

[^2]:  Automattic, Github, 2025, *Mongoose*, accessed on 25 May 2025, https://github.com/Automattic/mongoose?tab=readme-ov-file

[^3]: MDN Web Docs, 2025, *Express/Noode introduction*, accessed on 10 May 2025, https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/Introduction

[^4]: Geeks for Geeks, 2025, *How to use JSON web tokens with Node.js?*, accessed on 10 May 2025, https://www.geeksforgeeks.org/how-to-use-json-web-tokens-with-node-js/

[^CORS]: MDN Web Docs, 2025, *Cross-Origin Resource Sharing (CORS)*, accessed on 10 May 2025, https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS

[^5]: Auth0, 2021, *Hashing in Action: Understanding bcrypt*, accessed on 10 May 2025,  https://auth0.com/blog/hashing-in-action-understanding-bcrypt/

[^6]: TeachmeJs, 2025, *Understanding dotenv: A Guide to Managing Environment Variables in Node.js*, accessed on 15 May 2025, https://teachmejs.com/understanding-dotenv-a-guide-to-managing-environment-variables-in-node-js/

[^7]: Jest on Github, 2025, *Delightful JavaScript Testing*, accessed on 5 May 2025, https://github.com/jestjs/jest

[^8]: Node.js, 2025 _Download Node.js®_, accessed on 27 May 2025, https://nodejs.org/en

[^9]: MongoDB, 2025, _Production Notes for Self-Managed Deployments_, accessed on 05 May 2025,
https://www.mongodb.com/docs/manual/administration/production-notes/

[^10]: State of JS, 2023, *Front-End Frameworks*, accessed on 05 May 2025, https://2023.stateofjs.com/en-US/libraries/front-end-frameworks/

[^11]: Prisma, 2025, *Prisma Documentation*, accessed on 15 May 2025, https://www.prisma.io/docs

[^12]: Heavy.AI, 2024, *Server-Side Rendering*, accessed on 15 May 2025, https://www.heavy.ai/technical-glossary/server-side-rendering#:~:text=Server%2Dside%20rendering%20(SSR),HTML%20page%20for%20the%20client

[^13]: Free Code Camp, 2020, *Flutter Course - Full Tutorial for Beginners (Build iOS and Android Apps)*, accessed on 16 May 2025 from Youtube, https://www.youtube.com/watch?v=pTJJsmejUOQ 

[^14]: Geeks for Geeks, 2025, *How to Connect Django with Reactjs ?*, accessed on 16 May 2025, https://www.geeksforgeeks.org/how-to-connect-django-with-reactjs/

[^15]: Hotwire.dev, 2025, *Hotwire, HTML over the wire*, accessed on 16 May 2025, https://hotwired.dev/

[^16]: MongoDB, 2025, *MongoDB Licensing*, accessed on 27 May 2025, https://www.mongodb.com/legal/licensing/community-edition

[^17]: Expressjs on GitHub, 2015, *MIT License, express / LICENSE*, accessed on 27 May 2025, https://github.com/expressjs/express/blob/master/LICENSE

[^18]: Nodejs on GitHub, 2022, *node / LICENSE*, accessed on 27 May 2025, https://github.com/nodejs/node/blob/main/LICENSE

[^19]: node-jsonwebtoken on GitHub, 2014, *node-jsonwebtoken / LICENSE*, accessed on 27 May 2025, https://github.com/auth0/node-jsonwebtoken/blob/master/LICENSE

[^20]: node.bcrypt.js on GitHub, 2021, *node.bcyrpt.js*, accessed on 27 May 2025, https://github.com/kelektiv/node.bcrypt.js?tab=readme-ov-file

[^21]: dotenv on GitHub, 2015, *BSD 2-Clause "Simplified" License*, accessed on 27 May 2025, https://github.com/motdotla/dotenv/blob/master/LICENSE

[^22]: jest on Github, 2024, *MIT License, jest / LICENSE*, accessed ib 27 May 2025, https://github.com/jestjs/jest/blob/main/LICENSE

[^23]: NPM, 2018, *cors*, accessed on 27 May 2025, https://www.npmjs.com/package/cors#license