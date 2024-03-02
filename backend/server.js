const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    process.exit(1);
});

//config
dotenv.config({path:"backend/config/config.env"});

//conecting to database
connectDatabase();
const server = app.listen(4000,()=>{

    console.log(`server is running on http://localhost:${process.env.PORT}`)
});



//unhandled Promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled Promise Rejection');

     server.close(()=>{
      process.exit(1);
     })
});
