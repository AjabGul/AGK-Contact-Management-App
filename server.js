// step 1: import express 
const express = require("express");
// step 3: import db.js for connection
const connectDB = require('./config/db');
// 6.2
const path = require('path');
// step 1.2: express in app
const app = express();

// step 4: connect to mongoDB by executing connectDB func
connectDB();

// step 5: init middle layer
app.use(express.json({ extended: false}))
// step 1.5: end point for postman --> send request to api and than deliver to local host
// app.get('/', (req, res) => res.json({msg: ' welcome to the contact API managet'}));

// 6- sever static files on production server
if(process.env.NODE_ENV === 'production'){
    // set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')))
}
// step 2: defining routes here ---> paths of users, auth and contacts
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// step 1.3: create port env var or local host 5000
const PORT = process.env.PORT || 5000;

// step 1.4: port is gonna listen. 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));