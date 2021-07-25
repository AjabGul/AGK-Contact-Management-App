// step 1: 
const jwt = require('jsonwebtoken');
const config = require('config');

// 2: middleware function will get three parameters req, res and next
module.exports = function(req, res, next){
    // get the token from header
    const token = req.header('x-auth-token');
    // check if token doesnt exist return error msg
    if(!token){
        return res.status(401).json({ msg: 'Authorizaton denied token missing'})
    }
    // verify token either it is okay or not
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        //  if there are multiful middleware to excute the next one
        // like email password etc
        next();
    } catch(err){
        res.status(401).json({ msg: 'invalid token'})
    }
}