const mongoose = require('mongoose');

// Connect to MongoDB
const connectDatabase = async () => {
    
        await mongoose.connect("mongodb://127.0.0.1:27017/", {
           
        });
        console.log(`Mongoose connected`);
     
};

module.exports = connectDatabase;