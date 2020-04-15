const dal = require("../data-access-layer/dal");

async function getAllVacationsAsync() {
    const sql = `SELECT 
                     vacationId as id, 
                     vacationName as vacationName, 
                     description as description, 
                     destination as destination, 
                     picFileName as imageFileName, 
                     DATE_FORMAT(startDate, "%Y-%m-%d") as startDate, 
                     DATE_FORMAT(endDate, "%Y-%m-%d") as endDate, 
                     price as price 
                FROM vacations`;
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

async function getOneVacationAsync(id) {
    const sql = `SELECT 
                    vacationId as id, 
                    vacationName as vacationName,  
                    description as description, 
                    destination as destination, 
                    picFileName as imageFileName, 
                    DATE_FORMAT(startDate, '%Y-%m-%d') as startDate, 
                    DATE_FORMAT(endDate, '%Y-%m-%d') as endDate,
                    price as price 
                FROM vacations WHERE vacationId = ${id}`;
    const vacations = await dal.executeAsync(sql);
    return vacations[0];
}

async function addVacationAsync(vacation, fileName) {
    const sql = `
        INSERT INTO vacations(description, vacationName, destination, picFileName, startDate, endDate, price)
        VALUES('${vacation.description}','${vacation.vacationName}','${vacation.destination}','${fileName}','${vacation.startDate}','${vacation.endDate}','${vacation.price}')`;
    const info = await dal.executeAsync(sql);
    vacation.id = info.insertId;
    return vacation;
}

async function updateFullVacationAsync(vacation, fileName) {
    const sql = ` 
        UPDATE vacations SET
            vacationName = '${vacation.vacationName}',
            description = '${vacation.description}',
            destination = '${vacation.destination}',
            picFileName = '${fileName}',
            startDate = '${vacation.startDate}',
            endDate = '${vacation.endDate}',
            price = '${vacation.price}'
        WHERE vacationId = ${vacation.id}`;
    const info = await dal.executeAsync(sql);
    return info.affectedRows === 0 ? null : vacation;
}


async function updatePartialVacationAsync(vacation, fileName) {

    let sql = "UPDATE vacations SET ";

    if (vacation.vacationName) {
        sql += `vacationName = '${vacation.vacationName}',`
    }
    if (vacation.description) {
        sql += `description = '${vacation.description}',`
    }
    if (vacation.destination) {
        sql += `destination = '${vacation.destination}',`
    }
    if (vacation.picFullName) {
        sql += `picFullName = '${fileName}',`
    }
    if (vacation.startDate) {
        sql += `startDate = '${vacation.startDate}',`
    }
    if (vacation.endDate) {
        sql += `endDate = '${vacation.endDate}',`
    }
    if (vacation.price) {
        sql += `price = '${vacation.price}',`
    }

    // Delete last comma from string: 
    sql = sql.substr(0, sql.length - 1);

    sql += ` WHERE vacationId = '${vacation.id}'`;

    const info = await dal.executeAsync(sql);
    return info.affectedRows === 0 ? null : vacation;
}

async function deleteVacationAsync(id) {
    const sql = `DELETE FROM vacations WHERE vacationId = ${id}`;
    await dal.executeAsync(sql);
    return id;
}

module.exports = {
    getAllVacationsAsync,
    getOneVacationAsync,
    addVacationAsync,
    updateFullVacationAsync,
    updatePartialVacationAsync,
    deleteVacationAsync
};