/* Importing Different Modules */

const {globalVariables} = require('./config/configuration');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const {mongoDbUrl, PORT} = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const fileUpload = require('express-fileupload');
const passport = require('passport');

const app = express();


// Configure Mongoose to Connect to MongoDB
mongoose.connect(mongoDbUrl, { useNewUrlParser: true })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});



/* Configure express*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


/*  Flash and Session*/
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());

/* Use Global Variables */
app.use(globalVariables);


/* File Upload Middleware*/
app.use(fileUpload());



/* Method Override Middleware*/
app.use(methodOverride('newMethod'));


/* Routes */
const AuthRoutes = require('./routes/AuthRoutes');


app.use('/', AuthRoutes);



/* Start The Server */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
