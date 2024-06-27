const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/create', async (req, res) => {
    const {username, email, password} = req.body;

    try {
        let user = await User.findOne({email});
        if(user) {
            return res.status(400).json({
                message: 'User already exists',
            })
        }

        user = new User({
            name: username,
            email,
            password
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        await user.save();

        return res.json({
            message: 'User is registered'
        })
    } catch (err) {
        console.log(err, 'Failed in creating a user');
        return res.status(500).json({
            message: 'Server Error. Please try again later!'
        })
    }

});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: 'Please send valid information'})
    }

    try {
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                message: 'Invalid Credentials',
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                message: 'Invalid Credentials',
            })
        }

        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(
            payload,
            'gagan2444',
            { expiresIn: '1h'},
            (err, token) => {
                if(err) console.log('Failed in token generation', err);
                return res.json({
                    message: 'Successful login',
                    token,
                })
            }
        )
    } catch (err) {
        console.log(err, 'Error in Login API');
        res.status(500).json({
            message: 'Server Error'
        })
    }
})

module.exports = router;