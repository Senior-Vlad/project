const axios = require('axios');
const Subscription = require('../models/Subscription');
const { sendWeatherEmail } = require('./emailService');
require('dotenv').config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
if (!WEATHER_API_KEY) throw new Error('WEATHER_API_KEY missing in .env');

async function checkWeatherAndNotify() {
  console.log('=== Running a condition check ===');
  const subs = await Subscription.find();
  const now = Date.now();

  for (const sub of subs) {
    console.log(`[${sub._id}] ${sub.email} → ${sub.city}`);
    let current;
    try {
      const res = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${sub.city}`
      );
      current = res.data.current;
      console.log(`Weather: ${current.temp_c}°C (${current.condition.text})`);
    } catch (e) {
      console.error(`Weather API error for ${sub.city}:`, e.message);
      continue;
    }

    const { type, value } = sub.condition;
    const temp = current.temp_c;
    const isRain = current.condition.text.toLowerCase().includes('rain');
    let shouldNotify = false, message = '';

    if (type === 'temperatureBelow') {
      shouldNotify = temp < value;
      message = `🚨 ${sub.city}: The temperature is below ${value}°C (now ${temp}°C)`;
    } else if (type === 'temperatureAbove') {
      shouldNotify = temp > value;
      message = `🔥 ${sub.city}: The temperature is above ${value}°C (now ${temp}°C)`;
    } else if (type === 'rain') {
      shouldNotify = isRain;
      message = `🌧️ ${sub.city}: It's raining (${current.condition.text})`;
    }

    const last = sub.lastNotified ? new Date(sub.lastNotified).getTime() : 0;
    if (shouldNotify && now - last >= 24 * 60 * 60 * 1000) {
      console.log('Message is sent:', message);
      try {
        await sendWeatherEmail(sub.email, `Weather Alert: ${sub.city}`, message);
        sub.lastNotified = now;
        await sub.save();
      } catch (err) {
        console.error('Message sending error:', err.message);
      }
    } else if (shouldNotify) {
      console.log('⌛ Notification is not ready yet (less then 24 hours from the previous)');
    }
  }
}

module.exports = { checkWeatherAndNotify };
