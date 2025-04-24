const { body, query } = require("express-validator");

exports.weatherValidation = [
  query("city")
    .notEmpty()
    .withMessage("City is mandatory")
    .isString()
    .trim()
];

exports.subscriptionValidation = [
  body("email")
    .isEmail()
    .withMessage("Invalid email"),
  body("city")
    .notEmpty()
    .withMessage("City is mandatory"),
  body("condition")
    .isObject()
    .withMessage("Condition has to be an object")
];