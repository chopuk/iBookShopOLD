// check if the user has a web token,
// i.e. they have successfully loggged in earlier

const jwt = require('jsonwebtoken');

module.exports = ( req, res, next ) => {
    const token = req.cookies.token
    try {
        const user = jwt.verify(token,'mysimplekey')
        req.user = user
        req.isAuthorized = true
        next()
    } catch (err) {
        res.clearCookie('token')
        req.isAuthorized = false
        return next()
    }
}