const jwt = require('jsonwebtoken');
const config = require('./config.json');

verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(403).send({
            message: 'No token provided!'
        });
    }
    
    const jwtToken = token.split(' ')[1];
    
    jwt.verify(jwtToken, config.jwt_key, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = {
    verifyToken: verifyToken
};
