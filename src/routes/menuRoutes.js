const express = require('express');

const menuController = require('../controllers/menuController.js');
const router = express.Router();

router.route(`/getrestaurantmenu/:restaurantId`).get(menuController.getRestaurantsMenu);
router.route(`/addmenu/:restaurantId`).post(menuController.addNewRestaurantMenu);

module.exports = router;
 