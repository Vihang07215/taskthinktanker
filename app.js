const express =require ('express');
const app = express();
const cookieParser = require("cookie-parser");

const {connectDatabase}= require('./database/db');
const routes = require('./routes/index');
const dotenv =require('dotenv');
dotenv.config();
port=9898;
app.use(cookieParser()); 
app.use(express.json());
const pool = connectDatabase();
app.use((req,res,next)=>{
    req.pool=pool;
    next();
});
app.use('/api',routes);
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})

