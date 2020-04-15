const dal = require("../data-access-layer/dal");

async function getAllUsersAsync() {
    const sql = `SELECT 
                    userId AS id, 
                    firstName AS firstName, 
                    lastName AS lastName, 
                    userName AS username, 
                    isAdmin AS isAdmin 
                FROM users`;
    const users = await dal.executeAsync(sql);
    return users;
}

async function getOneUserAsync(id) {
    const sql = `SELECT 
                    userId AS id,  
                    firstName AS firstName, 
                    lastName AS lastName, 
                    userName AS username, 
                    isAdmin AS isAdmin 
                FROM users WHERE userId = ${id}`;
    const users = await dal.executeAsync(sql);
    return users[0];
}

async function addUserAsync(user) {
    const check = await checkIfUsernameExist(user.username);
    if (check.success === true) {
        const sql = `
        INSERT INTO users(firstName, lastName, userName, password, isAdmin)
        VALUES('${user.firstName}','${user.lastName}','${user.username}','${user.password}','0')`;
        const info = await dal.executeAsync(sql);
        user.id = info.insertId;
        return {
            success: true,
            user: user
        };
    }
    else if (check.success === false) {
        return (await checkIfUsernameExist(user.username))
    }
}

async function checkIfUsernameExist(username) {
    const sql = `SELECT * FROM users WHERE userName = "${username}"`;
    const result = await dal.executeAsync(sql);
    if (result.length) {
        return {
            success: false,
            message: "Username Already Exist",
        }
    }
    return {
        success: true
    }
}

async function updateFullUserAsync(user) {
    const sql = `
        UPDATE users SET
        firstName = ${user.destination},
        lastName = ${user.lastName},
        username = ${user.username},
        password = ${user.endDate}
        WHERE userId = ${user.id}`;
    const info = await dal.executeAsync(sql);
    return info.affectedRows === 0 ? null : user;
}


async function updatePartialUserAsync(user) {

    let sql = "UPDATE users SET ";

    if (user.firstName) {
        sql += `firstName = '${user.firstName}',`
    }
    if (user.lastName) {
        sql += `lastName = ${user.lastName},`
    }
    if (user.username) {
        sql += `username = ${user.username},`
    }
    if (user.password) {
        sql += `password = '${user.password}',`
    }


    // Delete last comma: 
    sql = sql.substr(0, sql.length - 1);

    sql += ` WHERE userId = ${user.id}`;

    const info = await dal.executeAsync(sql);
    return info.affectedRows === 0 ? null : user;
}

async function deleteUserAsync(id) {
    const sql = `DELETE FROM users WHERE userId = ${id}`;
    await dal.executeAsync(sql);
    return id;
}

module.exports = {
    getAllUsersAsync,
    getOneUserAsync,
    addUserAsync,
    updateFullUserAsync,
    updatePartialUserAsync,
    deleteUserAsync
};