const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const Users = require('../models/userModel')

const initialize = (passport) => {
    const authenticateUser = async (username, password, done) => {
        
        Users.findOne({username: username})
        .then(user => {
            if(user == null){
                return done(null, false, {message: "Username not found!"})
            }
   
    

                bcrypt.compare(password, user.password, function(err,result){
                    if(err){
                        throw(err)
                    }
                    if(result){
                        return done(null, user)
                    }else{
                        return done(null, false, {message: "Password is incorrect!"})
                    }
                })

                
           
        });

    }
    passport.use(new LocalStrategy({username: 'username'}, authenticateUser))

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
          cb(null, { id: user.id, username: user.username});
        });
      });
      
      passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
          return cb(null, user);
        });
      });
}

module.exports = initialize;