const { databaseError } = require('../errorHandlers/databaseError.js');
const database = require('../dbConnection.js');

const getAllRestaurants = (req, res) => {
    try {
        const query = `
            SELECT b.*, GROUP_CONCAT(l.landmark) AS landmarks
            FROM basicInfo b
            LEFT JOIN landmarks l ON b.id = l.restaurantId
            GROUP BY b.id;
        `;
        database.query(query).then(([rows, fields]) => {
            res.status(200).json(rows);
        });
    } catch (error) {
        databaseError(res, 404, error.message || "Internal Server Error");
    }
};

const addNewRestaurant = async (req, res) => {
    try {
        const { restaurantName, phoneNumber, streetName, openingHours, landmarks } = req.body;

        // Insert restaurant information into the restaurants table
        const restaurantQuery = 'INSERT INTO basicInfo (restaurantName, phoneNumber, streetName, openingHours) VALUES (?, ?, ?, ?)';
        const restaurantValues = [restaurantName, phoneNumber, streetName, openingHours];

        const [restaurantResult] = await database.execute(restaurantQuery, restaurantValues);
        const restaurantId = restaurantResult.insertId;

        // Insert landmarks into the landmarks table
        if (landmarks.length > 0) {
            const landmarkQuery = 'INSERT INTO landmarks (restaurantId, landmark) VALUES (?, ?)';
            const landmarkValues = landmarks.map(landmark => [restaurantId, landmark]);
            console.log(landmarkValues);
            await Promise.all(landmarkValues.map(value => database.execute(landmarkQuery, value)));
        }

        console.log('Restaurant inserted successfully with landmarks');
        res.status(201).json({ message: 'Restaurant inserted successfully', restaurantId });
    } catch (error) {
        console.error('Exception occurred:', error);
        databaseError(res, 500, error.message || 'Internal Server Error');
    }
};


module.exports = {
    getAllRestaurants,
    addNewRestaurant,
}