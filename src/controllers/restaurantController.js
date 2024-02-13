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
        const { restaurantId } = req.params;

        const query = `
            SELECT landmark
            FROM landmarks
            WHERE restaurantId = ?;
        `;

        // Execute the query with the provided restaurantId
        database.query(query, [restaurantId])
            .then(([rows, fields]) => {
                const landmarks = rows.map(row => row.landmark);

                res.status(200).json(landmarks);
            })
            .catch(error => {
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addNewRestaurant = async (req, res) => {
    try {
        const { restaurantName, phoneNumber, streetName, startTime, closeTime, landmarks } = req.body;

        function convertTimeTo12HourFormat(time) {
            const [hours, minutes] = time.split(':').map(Number);

            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12;
            // Format the time in 12-hour format
            const time12HourFormat = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
            return time12HourFormat;
        }

        const openingHours = {
            start: convertTimeTo12HourFormat(startTime),
            end: convertTimeTo12HourFormat(closeTime),
        }

        // Insert restaurant information into the restaurants table
        const restaurantQuery = 'INSERT INTO basicInfo (restaurantName, phoneNumber, streetName, openingHours) VALUES (?, ?, ?, ?)';
        const restaurantValues = [restaurantName, phoneNumber, streetName, openingHours];

        const [restaurantResult] = await database.execute(restaurantQuery, restaurantValues);
        const restaurantId = restaurantResult.insertId;

        // Insert landmarks into the landmarks table
        if (landmarks.length > 0) {
            const landmarkQuery = 'INSERT INTO landmarks (restaurantId, landmark) VALUES (?, ?)';
            const landmarkValues = landmarks.map(landmark => [restaurantId, landmark]);
            await Promise.all(landmarkValues.map(value => database.execute(landmarkQuery, value)));
        }

        res.status(201).json({ message: 'Restaurant inserted successfully', restaurantId });
    } catch (error) {
        databaseError(res, 500, error.message || 'Internal Server Error');
    }
};


module.exports = {
    getAllRestaurants,
    getLandmarksForRestaurant,
    addNewRestaurant,
}