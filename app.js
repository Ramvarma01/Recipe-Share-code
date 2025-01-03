const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

//DOTENV 
dotenv.config();

//Mongo db connection
connectDB();

//REST OBJECT
const app = express();

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//ROUTES
app.use(require('./routes/UserRoutes'));
app.get('/', (req, res)=> {
  res.send({
     status:'ok',
      success: true,
     message: 'Recipe Share'
   })
//   // res.status(200).json({message:'Hello World'})
// });


//PORT
const  PORT = process.env.PORT || 8080;


app.listen(PORT,()=>{
    console.log(`Node js server started on PORT : ${PORT} `.bgGreen.white);
})
