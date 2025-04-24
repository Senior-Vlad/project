const mongoose = require("mongoose");



const subscriptionSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"]
  },
  city: { 
    type: String, 
    required: true 
  },
  condition: {
    type: {
      type: String,
      enum: ["temperatureBelow", "temperatureAbove", "rain"],
      required: true
    },
    value: {
      type: Number,
      required: function() {
        return this.condition.type !== "rain";
      }
    }
  },
  lastNotified: Date
});
subscriptionSchema.index({ email: 1, city: 1 }, { unique: true });
module.exports = mongoose.model("Subscription", subscriptionSchema);