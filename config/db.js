// step 1: import mongoose and config
const mongoose = require('mongoose');
const config = require('config');

// step 2: variable for calling mongoURI from json defult.js
const db = config.get('mongoURI');

// step 3: connectDB function to connect with mangoaltas DB via mangoose mmm

const connectDB = async () => {
    try {
        
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB');
    } catch(err){
        console.error(err.message);
        process.exit(1);
    }

}



module.exports = connectDB;