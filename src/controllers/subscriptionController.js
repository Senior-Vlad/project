const Subscription = require("../models/Subscription");
const { validationResult } = require("express-validator");

exports.createSubscription = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, city, condition } = req.body;
    
    const newSubscription = await Subscription.create({
      email,
      city,
      condition,
      lastNotified: null
    });

    res.status(201).json(newSubscription);
  } catch (err) {
    res.status(500).json({ error: `Creating a subscription error. ${err}` });
  }
};