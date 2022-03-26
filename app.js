const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')

// // Connect to DB
// mongoose.connect(config.database)
//     //On Connection
//     .then(() => {
//         console.log("Connected to database " + config.database);
//     })
//     //On error
//     .catch((err) =>{
//         console.error('Database error :' + err);
//     });

// Connect To Database (OLD CODE)
mongoose.connect(config.database, { useMongoClient: true});
// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to Database '+config.database);
});
// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error '+err);
});

const app = express();

const users = require('./routes/users');

//Port
const port = process.env.PORT || 3000;


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

//Start server
app.listen(port, () => {
    console.log('Server started on port: ' + port);
})
