const router = require('express').Router();
const { subscriptionValidation } = require('../utils/validators');
const { createSubscription } = require('../controllers/subscriptionController');

router.post('/', subscriptionValidation, createSubscription);

module.exports = router;
