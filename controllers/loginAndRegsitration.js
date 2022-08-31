const passport = require('passport');
const Users = require('../models/userModel')
const bcrypt = require('bcrypt');

const get_login = (req,res) => {
    res.render('login');
}

const post_login = (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next)
}

const get_register = (req,res) => {
    res.render('register');
}

const post_register = (req,res)=>{
    
    const {name, gender, dob, username, password, confirmPassword} = req.body;

    const error = [];

    if(!name || gender === 'Pick Your Gender' || !dob || !username || !password || !confirmPassword){
        error.push("Please fill in all the fields!")
    }

    if(password !== confirmPassword){
        error.push("Passwords do not match!")
    }

    if(error.length === 0){
        const preventDuplicateUsername = async() => {
            const checkUser = await Users.findOne({username: username});
  

            if(checkUser !== null){
                error.push("Username is taken!")
                res.render('register', {error})
                return;
            }else{
                const newUserObj = {
                    name,
                    username,
                    dob,
                    password,
                    dob,
                    profilepicture: 'NA'
                }

                const addUser = () => {
                    console.log(newUserObj);
                    const addNewUser = new Users(newUserObj);

                    bcrypt.hash(newUserObj.password, 10, function(err, hash) {
                        if(err){
                            console.log(err);
                            return;
                        }

                        addNewUser.password = hash;
                        console.log(addNewUser);
                        const saveNewUser = addNewUser.save();

                        if(saveNewUser){
                            req.flash('success', 'Registered Successfully!')
                            res.redirect('login')
                        }else{
                            res.send("We've hit a problem!")
                        }
                    });
                }
                addUser();

            }
        }

        preventDuplicateUsername();
    }else{
        res.render('register', {error})
    }
}

const delete_login = (req,res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('error', 'Logged out!')
        res.redirect('/login');
      });
}


module.exports = {
    get_login,
    get_register,
    post_login,
    delete_login,
    post_register
}