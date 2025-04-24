const router = require("express").Router();
const { createSubscription } = require("../controllers/subscriptionController");
const { subscriptionValidation } = require("../utils/validators");

router.post("/subscriptions", subscriptionValidation, createSubscription);

module.exports = router;