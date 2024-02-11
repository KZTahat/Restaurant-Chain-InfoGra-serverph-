const { databaseError } = require('../errorHandlers/databaseError.js');
const database = require('../dbConnection.js');

const getAllRestaurants = (req, res) => {
    try {
        const query = 'select * from basicInfo';
        database.query(query).then(([rows, fields]) => {
            res.status(200).json(rows);
        })
    }
    catch (error) {
        databaseError(res, 404, error.message || "Internal Server Error");
    }
}

const getLandmarksForRestaurant = (req, res) => {
    try {
        const { restaurantId } = req.query;

        if (!restaurantId) {
            return res.status(400).json({ error: 'restaurantId parameter is required' });
        }

        const query = `
            SELECT landmark
            FROM landmarks
            WHERE restaurantId = ${restaurantId};
        `;

        // Execute the query with the provided restaurantId
        database.query(query)
            .then(([rows, fields]) => {
                const landmarks = rows.map(row => row.landmark);

                res.status(200).json(landmarks);
            })
            .catch(error => {
                console.error('Error fetching landmarks:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } catch (error) {
        console.error('Exception occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
    getLandmarksForRestaurant,
    addNewRestaurant,
}