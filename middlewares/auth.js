const jwt = require('jsonwebtoken');

const authenticateJwt = (req, res, next) => {
    const { authtoken } = req.headers;

    if(!authtoken) {
        return res.status(500).json({
            message: 'Invalid request'
        })
    }

    try {
        const tokenDetails = jwt.verify(authtoken, 'gagan2444')

        if(!tokenDetails) {
            return res.status(500).json({
                message: 'Invalid request'
            })
        }

        req.user = tokenDetails;
        next();
    } catch (err) {
        console.log(err, 'error in middleware method: authenticareJwt');
        return res.status(500).json({
            message: 'Server Error'
        })
    }
}

module.exports = authenticateJwt;