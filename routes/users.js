const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const User = require('../models/user')
const Lists = require('../models/shoplist');

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg:'Failed to register user'})
        } else {
            res.json({success: true, msg: 'User registered'})
        }
    });

});

//Auth
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUserName(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg:'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 86400 //1 day
                });
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg:'Wrong password'});
            }
        });
    });
});


// Lists
router.get('/lists', passport.authenticate('jwt', {session:false}), (
    req, res, next) => {
    const uid = jwt.decode(req.headers.authorization.substring(4, req.headers.authorization.length), config.secret).data._id
    Lists.getListByUserId(uid, (err, lists) => {
        if(err){
            res.json({success: false, msg: err})
        } else {
            res.json({success:true, lists: lists})
        }
    })
});

// Add list
router.post('/lists/add', passport.authenticate('jwt', {session:false}),
    (req, res, next) => {
    let newList = new Lists({
        name: req.body.name,
        userId: jwt.decode(req.headers.authorization.substring(4, req.headers.authorization.length), config.secret).data._id,
        items: req.body.items
    });
    Lists.addList(newList, (err, list) => {
        if(err){
            res.json({success: false, msg:'Failed to add list' + err})
        } else {
            res.json({success: true, msg: 'list added'})
        }
    });

});

//Update list
router.post('/lists/update', passport.authenticate('jwt', {session:false}),
    (req, res, next) => {
    Lists.updateOne(req.body, (err, list) => {
        if(err){
            res.json({success: false, msg:'Failed to add list' + err})
        } else {
            res.json({success: true, msg: 'list updated'})
        }
    });

});




module.exports = router;