import express from 'express';
import cors from 'cors';

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

// simple root for testing purposes
app.get('/', (req, res) => {
    res.json({message: 'welcome to jwt auth service'})
})

// set port then listen on port
const PORT = process.env.PORT?? 8080
app.listen(PORT, () =>{ 
    console.log('Server is listening on port: '+ PORT)
})

export {}


