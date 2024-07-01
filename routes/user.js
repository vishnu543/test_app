const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJwt = require('../middlewares/auth');

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

router.get('/get-user-data', authenticateJwt, async (req, res) => {
    const { user } = req.user;

    try {
        const userDetails = await User.findById(user.id);
        if(!userDetails) {
            return res.status(400).json({
                message: 'User not found'
            })
        }

        return res.json({
            message: 'Success',
            userDetails: {
                name: userDetails.name,
                email: userDetails.email,
            }
        })


    } catch (err) {
        console.log('Error in Get User data API: ', err);
        return res.status(500).json({
            message: 'Server Error'
        })
    }
})

router.delete('/delete', authenticateJwt, async (req, res) => {
    const { user } = req.user;
    
    try {
        const userDetails = await User.findById(user.id);
        if(!userDetails) {
            return res.status(400).json({
                message: 'Invalid user'
            })
        }

        const deleatedDetails = await User.deleteOne({ _id: user.id})
        console.log(deleatedDetails, 'the deleted details');
        return  res.json({
            message: "Successfully deleted your account"
        })
    } catch (err) {
        console.log(err, 'error in deleting the user');
        return res.status(500).json({
            message: 'Server Error'
        })
    }
})

router.put('/update-user-name', authenticateJwt, async (req, res) => {
    const { user } = req.user;
    const { key, updatedValue } = req.body;

    try {
        const userDetails = await User.findById(user.id);
        if(!userDetails) {
            return res.status(400).json({
                message: 'Invalid user'
            })
        }

        let updatedJson;

        if(key === 'email') {
            updatedJson = {email: updatedValue};
        } else if (key === 'name') {
            updatedJson = {name: updatedValue}
        }
 
        console.log(updatedJson, 'the updated json');

        const updatedDetails = await User.findByIdAndUpdate(
            userDetails.id,
            updatedJson,
            { new: true } // Return the updated document
        );

        // const updatedDetails = await User.updateOne({ name: updatedName})
        console.log(updatedDetails, 'the updated details');
        return  res.json({
            message: "Successfully updated your name"
        })
    } catch (err) {
        console.log(err, 'error in deleting the user');
        return res.status(500).json({
            message: 'Server Error'
        })
    }
})

module.exports = router;