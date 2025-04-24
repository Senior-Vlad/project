const Subscription = require('../models/Subscription');
const { validationResult } = require('express-validator');

exports.createSubscription = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, city, condition } = req.body;
  try {
    const exists = await Subscription.findOne({ email, city });
    if (exists)
      return res
        .status(409)
        .json({ error: 'Subscription already exists for this email & city' });

    const sub = await Subscription.create({ email, city, condition });
    res.status(201).json(sub);
  } catch (err) {
    console.error('Create subscription error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
