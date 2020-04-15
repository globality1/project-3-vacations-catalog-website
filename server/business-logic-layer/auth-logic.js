const dal = require("../data-access-layer/dal");
const jwtConfig = require("../data-access-layer/jwtConfig")

async function validateUser(username, password) {
    if (!username || !password) {
        return {
            success: false,
            message: "Missing Username/Password"
        }    
    }
    const validationResponse = await validateUsername(username,password)
    return validationResponse;
}

async function validateUsername(username, password) {

    const sql = `Select * from users where userName = "${username}"`;
    const result = await dal.executeAsync(sql);
    if (result.length) { 
        return validateFullUser(username,password)
    }
    else {
        return {
            success: false,
            message: "Username Doesn't exist"
        }
    }
}

async function validateFullUser(username,password) {
    const sql = `Select 
                    userId as id, 
                    firstName as firstName,
                    lastName as lastName,
                    userName as userName,
                    isAdmin as isAdmin 
                    FROM users 
                    WHERE userName = "${username}" AND password = "${password}"`;
    const result = await dal.executeAsync(sql);
    const users = result.map(n => Object.assign({}, n));
    const user = users[0]
    if (result.length) { 
        return generateToken(user)
    }
    else {
        return {
            success: false,
            message: "Password is incorrect"
        }
    }
}

async function generateToken(user) {
    const token = jwtConfig.generateToken(user);
    return {
        success: true,
        message: 'Authentication successful!',
        userRole: user.isAdmin,
        token: token,
        userInfo: user
      }
}

module.exports = {
    validateUser
}