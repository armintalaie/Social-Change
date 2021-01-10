const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const passport = require('passport')
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require("../database")




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
                    points: 0,
                    trusts: undefined,
                    trusted_by: [],
                    donations: [],
                    movements: [],
                    balance: 200,
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
    successRedirect: '/home',
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



router.get('/profile', async(req, res) => {
    if (!req.user) {
        res.render('signin')
    } else {
        res.locals.movements = await db.getMovements(req.user._id)
    
        //console.log(res.locals.movements)
        res.locals.user = req.user;
        res.locals.trusted_by = await db.getTrustedBy(req.user._id);
        res.locals.trusts = await db.getUser(req.user.trusts);
    
        res.render('profile')
    }
        
})

router.get('/profile/:id', async(req, res) => {
    let user = await db.getUser(mongoose.Types.ObjectId(req.params.id));
    res.locals.movements = await db.getMovements(user._id);

    //console.log(res.locals.movements)
    res.locals.user = user;
    res.locals.trusted_by = await db.getTrustedBy(user._id);
    res.locals.trusts = await db.getUser(user.trusts);

    res.render('profile')


})

router.get('/trust/:truster/:trustee', async (req, res) => {
    let truster = mongoose.Types.ObjectId(req.params.truster);
    let trustee = mongoose.Types.ObjectId(req.params.trustee);
    await db.trust(truster_id,trustee_id);
    //res.render('lp')
})

module.exports = router


















module.exports = router