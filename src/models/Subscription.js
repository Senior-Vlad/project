const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/\S+@\S+\.\S+/, "Invalid email"],
    lowercase: true
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true
  },
  condition: {
    type: {
      type: String,
      enum: ["temperatureBelow", "temperatureAbove", "rain"],
      required: [true, "Condition type is required"]
    },
    value: {
      type: Number,
      required: function() { return this.condition.type !== 'rain'; }
    }
  },
  lastNotified: {
    type: Date,
    default: null
  }
});

subscriptionSchema.index({ email: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
