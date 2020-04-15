const dal = require("../data-access-layer/dal");

async function getAllFollowAsync() {
    const sql = `SELECT 
                    id as id, 
                    userId as userId, 
                    vacationId as vacationId 
                    FROM followers`;
    const followers = await dal.executeAsync(sql);
    return followers;
}

async function getAllFollowsByUserAsync(userId) {
    const sql = `SELECT 
                    id as id, 
                    userId as userId, 
                    vacationId as vacationId 
                    FROM followers 
                    WHERE userId = ${userId}`;
    const followsByUser = await dal.executeAsync(sql);
    return followsByUser;
}



async function getAllFollowCountAsync() {
    const sql = `SELECT 
                    v.vacationId as x , 
                    Count(*) as y 
                    FROM followers f 
                    LEFT JOIN vacations v ON v.vacationId = f.vacationId 
                    GROUP BY f.vacationId`;
    const followers = await dal.executeAsync(sql);
    return followers;
}

async function addFollowAsync(follow) {
    const sql = `
        INSERT INTO followers(userId, vacationId)
        VALUES('${follow.userId}','${follow.vacationId}')`;
    const info = await dal.executeAsync(sql); 
    info.id = info.insertId;
    return info;
}

async function deleteFollowAsync(follow) {
    const sqlToDelete = `DELETE FROM followers WHERE userId = ${follow.userId} AND vacationId = ${follow.vacationId}`;
    await dal.executeAsync(sqlToDelete);   
    return follow;
}

module.exports = {
    getAllFollowAsync,
    getAllFollowsByUserAsync,
    getAllFollowCountAsync,
    addFollowAsync,
    deleteFollowAsync
};