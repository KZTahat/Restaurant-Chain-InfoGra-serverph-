const { databaseError } = require('../errorHandlers/databaseError.js');
const database = require('../dbConnection.js');

const getRestaurantsMenu = (req, res) => {
    try {

        const { restaurantId } = req.params;

        const query = `
        SELECT *
        FROM menu
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

const addNewRestaurantMenu = async (req, res) => {
    try {
        const menuItems = req.body;
        const { restaurantId } = req.params;

        const restaurantQuery = 'INSERT INTO menu (restaurantId, menuItem, servingTime) VALUES (?, ?, ?)';
        menuItems.map(async ({ menuItem, servingTime }) => {
            const values = [restaurantId, menuItem, servingTime];
            await database.execute(restaurantQuery, values);
        })

        res.status(201).json({ message: 'Menu inserted successfully', restaurantId });
    } catch (error) {
        databaseError(res, 500, error.message || 'Internal Server Error');
    }
};

module.exports = {
    getRestaurantsMenu,
    addNewRestaurantMenu,
}