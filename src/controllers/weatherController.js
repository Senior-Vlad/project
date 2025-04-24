const axios = require('axios');

exports.getWeather = async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is mandatory' });

  try {
    const resp = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&lang=uk`
    );
    const cur = resp.data.current;
    res.json({
      temperature: cur.temp_c,
      humidity: cur.humidity,
      description: cur.condition.text
    });
  } catch (e) {
    if (e.response?.data?.error?.code === 1006)
      return res.status(404).json({ error: "City couldn't be found" });
    res.status(500).json({ error: 'Fetching weather error' });
  }
};
