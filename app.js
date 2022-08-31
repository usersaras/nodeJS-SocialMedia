const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const Posts = require('./models/postModel');

const initializePassport = require('./config/passport-config')
initializePassport(passport)

const dbURL = 'mongodb+srv://nodenetninja:nodenetninja@netninjablog.rfjoy.mongodb.net/learn-passport?retryWrites=true&w=majority';

const connectDB = async() => {
    try{
        const db = await mongoose.connect(dbURL);
        const connection = await db;

        if(connection){
            console.log("Connected to MongoDB!")
            app.listen(PORT, ()=>{
                console.log(`Listening on port ${PORT}...`) 
            })
        }
        else{
            console.log("Failed to connect!")
        }
    }
    catch(e){
        console.log(e);
    }
}
connectDB();

const loginRegsiterRoute = require('./routes/loginAndRegistration')
const postRoute = require('./routes/postRoute');

const app = express();

app.use(express.static('public'))
app.use(flash());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }));
app.use(function(req, res, next){
    res.locals.messages = req.flash();
    next();
  });
app.use(passport.initialize());
app.use(passport.session()); 
app.use(express.urlencoded({extended: false}));
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs')


const checkAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }

    req.flash('error', 'Please login to view this resource!');
    res.redirect('/login');
}

app.get('/', checkAuthenticated, (req,res)=>{
    console.log("uname: ", req.user.username);
    Posts.find()
    .then(post=>{
        post.sort((a, b) => b.createdAt - a.createdAt);

        sendPost = post.slice(0,5)
        res.render('index', {user: req.user, postArray: [...sendPost]});
    })
    
})



app.use('/', loginRegsiterRoute);
app.use('/', checkAuthenticated, postRoute);

const PORT = process.env.PORT || 5123;
