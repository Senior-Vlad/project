const router = require('express').Router();
const { weatherValidation } = require('../utils/validators');
const { getWeather } = require('../controllers/weatherController');

router.get('/', weatherValidation, getWeather);

module.exports = router;
