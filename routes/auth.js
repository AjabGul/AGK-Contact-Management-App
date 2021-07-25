// step 1: import express 
const express = require('express');
// step 2: import router 
const router = express.Router();
// 5 import express validator, bcrypt, jwt and config
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const User =require('../models/Users');


// step 3: create api end point for users registration

// @route GET api/auth
// @desc  Get the logged in user
// @access private 

router.get('/', auth, async (req, res) => {
    // step 6: get the loged in user and his contects
    try {
        // 6.1 get the user by id present in token but not password
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
    } catch(err) {
        // 6.2
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// step 4: second route to post 


// @route GET api/auth
// @desc  Authorize the user and get the token
// @access Public 

router.post('/', [
    // 5.1 for new user we check email and password
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Please enter a password').exists()
], async (req, res) => {
    // 5.2 after check we have to execute to run validation result for error check
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    // 5.3 destructure email and password in body

    const { email, password } = req.body;

    // 5.4 now try and cash

    try {
        //5.4.1 to check that user exist in DB which will save
        let user = await User.findOne({email});
        // 5.4.2 if user not exist return error
        if(!user){
            return res.status(400).json({ msg: 'A user with this email does not exist'})
        }

        // 5.4.3 if user exist than we check password
        //  password is hashed so we will decode by comparing password and hash password from DB
        const isMatch = await bcrypt.compare(password, user.password);
        // 5.4.4 if password not match we will pass error msg and if both email and password match we will add token 
        if(!isMatch){
            return res.status(400).json({ msg : 'Incorrect password'})
        }

        // 5.5 create payload object
        const payload = {
            user: {
                id: user.id
            }
        }

        // 5.6 create jwt token 
        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 3600000
        }, (err, token) => {
            if(err) throw err;
            res.json({ token })
        }) 

    } catch(err){
        // 5.7 
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// export to server 
module.exports = router; 