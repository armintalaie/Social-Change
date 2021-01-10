const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const session = require('express-session');
const bcrypt = require('bcrypt');






/**  sign up user with information posted
 *   hash password of user
 *   save user info on mongodb server
 */
router.post('/signup', (req, res) => {
    const { name, email, password, password2, bio } = req.body
    let errors = []
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields :)" })
    }
    //check if match
    if (password !== password2) {
        errors.push({ msg: "The passwords don't match" });
    }

    //check if password is more than 6 characters
    if (password.length < 6) {
        errors.push({ msg: 'password atleast 6 characters' })
    }
    if (errors.length > 0) {
        res.render('signup', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        })
    } else {
        //validation passed
        User.findOne({ email: email }).exec((err, user) => {
            if (user) {
                errors.push({ msg: 'email already registered' });
                render(res, errors, name, email, password, password2, bio);

            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                    bio: bio,
                    points: 0
                });

                //hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt,
                        (err, hash) => {
                            if (err) throw err;
                            //save pass to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then((value) => {
                                    res.redirect('signin');
                                })
                                .catch(value => console.log(value));

                        }));
            }
        })
    }
})



// Create new user if information is sufficient
router.get('/signup', (req, res) => {
    if (!req.user)
        console.log('not signed in')
    res.render('signup')
})


// User singin authentication
router.post('/signin', passport.authenticate('local', {
    successRedirect: '/signup',
    failureRedirect: '/signup',
}))


// User signin request
router.get('/signin', (req, res) => {
    res.render('signin')

})



// sign out user and remove session
router.get('/signout', (req, res) => {
    router.get('/user/signout', (req, res) => {
        userAuth
        req.logout();
        res.redirect('signin');
    })
})


module.exports = router


















module.exports = router