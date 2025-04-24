require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');
const cron = require('node-cron');
const { checkWeatherAndNotify } = require('./src/services/weatherAlertService');

const app = express();
connectDB();

app.use(express.json());
app.use('/subscriptions', subscriptionRoutes);
app.use('/weather', weatherRoutes);
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

cron.schedule('* * * * *', checkWeatherAndNotify);
console.log('Cron job scheduled: Checking conditions every minute');
