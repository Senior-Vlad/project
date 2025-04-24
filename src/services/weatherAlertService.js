const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const axios = require("axios");
const { sendAlert } = require("./emailService");

const checkConditions = async () => {
  const subscriptions = await Subscription.find();
  
  for (const sub of subscriptions) {
    const { data } = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${sub.city}&lang=uk`
    );

    const currentTemp = data.current.temp_c;
    const isRaining = data.current.condition.text.toLowerCase().includes("дощ");

    let shouldNotify = false;
    let message = "";

    switch (sub.condition.type) {
      case "temperatureBelow":
        shouldNotify = currentTemp < sub.condition.value;
        message = `Temperature in ${sub.city} is below ${sub.condition.value}°C`;
        break;
      case "temperatureAbove":
        shouldNotify = currentTemp > sub.condition.value;
        message = `Temperature in ${sub.city} is above ${sub.condition.value}°C`;
        break;
      case "rain":
        shouldNotify = isRaining;
        message = `In ${sub.city} is raining!`;
        break;
    }

    if (shouldNotify && (!sub.lastNotified || new Date() - sub.lastNotified > 24 * 60 * 60 * 1000)) {
      await sendAlert(sub.email, message);
      sub.lastNotified = new Date();
      await sub.save();
    }
  }
};

// Запуск перевірки щодня о 08:00
cron.schedule("0 8 * * *", checkConditions);