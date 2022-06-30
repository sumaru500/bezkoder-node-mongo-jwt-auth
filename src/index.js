import express from 'express';
import cors from 'cors';
import connectDB from './dbBoot/index.js';
import authRoute from './routes/auth.routes.js';
import userRoute from './routes/user.routes.js';


const app = express();

// cors configuration
var corsOptions = {
    origin: 'http://localhost:8081'
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// make DB connection
const db = connectDB();

// simple root for testing purposes
app.get('/', (req, res) => {
    res.json({message: 'welcome to jwt auth service'})
})

// routes
authRoute(app);
userRoute(app);

// set port then listen on port
const PORT = process.env.PORT?? 8080
app.listen(PORT, () =>{ 
    console.log('Server is listening on port: '+ PORT)
})

export {}


