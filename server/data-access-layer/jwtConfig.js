const jwt = require("jsonwebtoken");

function returnSecretKey() {
    const secretKey = "MonkeyIsOnFire";
    return secretKey;
}


function generateToken(user) {
    const token = jwt.sign({user},
    returnSecretKey(),
    { 
        expiresIn: '4h'
    }
    );
    return token;
}



module.exports = {
    returnSecretKey,
    generateToken
};