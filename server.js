const express = require("express");
const connectDB = require("./config/db");
const weatherRoutes = require("./src/routes/weatherRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRouter");

const app = express();

connectDB("weatherDB");

app.use(express.json());
app.use("/weather", weatherRoutes);
app.use("/", subscriptionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));