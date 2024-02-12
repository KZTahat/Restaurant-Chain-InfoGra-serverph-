const express = require('express');

const maintenanceController = require('../controllers/maintenanceController.js');
const router = express.Router();

router.route(`/getmaintenanceinfo/:restaurantId`).get(maintenanceController.getMaintenanceInfo);
router.route(`/addmaintenanceinfo/:restaurantId`).post(maintenanceController.addMaintenanceInfo);

module.exports = router;
