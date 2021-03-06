const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')

// Connect to DB
mongoose.connect(config.database)
    //On Connection
    .then(() => {
        console.log("Connected to database " + config.database);
    })
    //On error
    .catch((err) =>{
        console.error('Database error :' + err);
    });



const app = express();

const users = require('./routes/users');

//Port
const port = 3000;


//CORS middleware
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Body parser middleware
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.get('/', (req,res) => {
    res.send('Invalid endpoint');
})

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// })

//Start server
app.listen(port, () => {
    console.log('Server started on port: ' + port);
})
