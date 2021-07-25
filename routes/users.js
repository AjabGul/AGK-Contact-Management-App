// step 1: import express 
const express = require('express');

// step 2: import router 
const router = express.Router();

// step 5: importing express validator using  check for validation results
const { check, validationResult } = require('express-validator/check');

// import bcrypt 
const bcrypt = require('bcryptjs')
// step 6: import jwt tokern
const jwt = require('jsonwebtoken');
// 6.5 import 
const config = require('config');

// step 4: import Users Models 
const User = require('../models/Users');

// step 3: create api end point for users registration

// @route Post api/users
// @desc  Register a user
// @access private 

router.post('/', [
    // step 5.1: checking validation of parameters
    check("name", 'Please enter a name').not().isEmpty(),
    check("email", 'Please enter a valid email').isEmail(),
    check("password", 'Please enter password with at least six charactor').isLength({min: 6})
], async (req, res) => {
    // 5.2 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email: email});

        if(user){
            return res.status(400).json({ msg: "A User with this email already exist"})
        }

        user =  new User({
            name,
            email,
            password
        });

        // 5.3 using bcrypt and gensalt algorithum to hash the password

        const salt = await bcrypt.genSalt(10);
         
        user.password = await bcrypt.hash(password, salt);
        // save in mangoDB 
        await user.save();

        // 6.2 create payload object
        const payload = {
            user: {
                id: user.id
            }
        }

        // 6.3 create jwt token 

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 3600000
        }, (err, token) => {
            if(err) throw err;
            res.json({ token })
        })

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// export to server 
module.exports = router;