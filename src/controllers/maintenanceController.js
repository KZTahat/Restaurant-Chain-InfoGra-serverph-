const { databaseError } = require('../errorHandlers/databaseError.js');
const database = require('../dbConnection.js');

const getMaintenanceInfo = (req, res) => {
    try {

        const { restaurantId } = req.params;

        const query = `
        SELECT *
        FROM maintenance
        WHERE restaurantId = ?;
    `;

        database.query(query, [restaurantId]).then(([rows, fields]) => {
            res.status(200).json(rows);
        })
    }
    catch (error) {
        databaseError(res, 404, error.message || "Internal Server Error");
    }
}

const addMaintenanceInfo = async (req, res) => {
    try {
        const { impact, startDate, endDate, maintenancePrice, comments } = req.body;
        const { restaurantId } = req.params;

        const query = 'INSERT INTO maintenance (restaurantId, impact, startDate, endDate, maintenancePrice, comments) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [restaurantId, impact, startDate, endDate, maintenancePrice, comments];
        await database.execute(query, values);


        res.status(201).json({ message: 'Maintenance added successfully', restaurantId });
    } catch (error) {
        databaseError(res, 500, error.message || 'Internal Server Error');
    }
};

module.exports = {
    getMaintenanceInfo,
    addMaintenanceInfo,
};