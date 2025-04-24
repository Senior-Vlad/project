const { body, query } = require('express-validator');

exports.weatherValidation = [
  query('city')
    .notEmpty().withMessage('City is mandatory')
    .isString().trim()
];

exports.subscriptionValidation = [
  body('email')
    .isEmail().withMessage('Invalid email'),
  body('city')
    .notEmpty().withMessage('City is mandatory'),
  body('condition.type')
    .isIn(['temperatureBelow','temperatureAbove','rain'])
    .withMessage('Invalid condition type'),
  body('condition.value')
    .optional()
    .isNumeric().withMessage('Value must be numeric')
];
