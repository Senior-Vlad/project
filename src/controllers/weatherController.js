const axios = require('axios');

exports.getWeather = async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is mandatory" });

  try {
    const apiKey = process.env.WEATHER_API_KEY; 
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=uk`;
    
    const response = await axios.get(url);
    const data = response.data;

    return res.json({
      temperature: data.current.temp_c, // °C
      humidity: data.current.humidity, // %
      description: data.current.condition.text 
    });

  } catch (err) {
    if (err.response?.data?.error?.code === 1006) {
      return res.status(404).json({ error: "City could not be found" });
    }
    return res.status(500).json({ error: "Fetching data error" });
  }
};                                  