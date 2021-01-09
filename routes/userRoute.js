const router = express.Router()
const User = require('../models/user')
const express = require('express')



/**  sign up user with information posted
 *   hash password of user
 *   save user info on mongodb server
 */
router.post('signup', (req, res) => {
    const { name, email, password, password2 } = req.body
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
        res.render('user/signup', {
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
                render(res, errors, name, email, password, password2);

            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
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

})


// User singin authentication
router.post('/signin', (req, res) => {
    passport.authenticate('local', {
        successRedirect: 'landing',
        failureRedirect: 'signin',
    })
})


// User signin request
router.get('/signin', (req, res) => {

})



// sign out user and remove session
router.get('/user/signout', (req, res) => {
    req.logout();
    res.redirect('signin');
})



















module.exports = router