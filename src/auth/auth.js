var jwt = require('jsonwebtoken');
const {jwtSecret} = require("../config");

function verifyJWTToken(jwtToken)
{
    return jwt.verify(jwtToken, jwtSecret);
}

module.exports = verifyJWTToken; 