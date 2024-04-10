const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL_CURRENT = process.env.REACT_APP_BASE_URL_CURRENT;
const BASE_URL_FORECAST = process.env.REACT_APP_BASE_URL_FORECAST;

const fetchWeatherCurrent = async (city) => {
	const response = await fetch(`${BASE_URL_CURRENT}?q=${city}&appid=${API_KEY}&units=metric`);
	if (!response.ok) {
		throw new Error("Current weather data not found");
	}
	return response.json();
};

const fetchWeatherForecast = async (city) => {
	const response = await fetch(`${BASE_URL_FORECAST}?q=${city}&appid=${API_KEY}&units=metric`);
	if (!response.ok) {
		throw new Error("Forecast weather data not found");
	}
	return response.json();
};

const processForecastData = (forecastData) => {
	const dailyForecasts = {};

	forecastData.list.forEach((point) => {
		const date = new Date(point.dt * 1000);
		const day = date.toISOString().split("T")[0];
		if (!dailyForecasts[day]) {
			dailyForecasts[day] = { temps: [], icons: [] };
		}
		dailyForecasts[day].temps.push(point.main.temp);
		dailyForecasts[day].icons.push(point.weather[0].icon);
	});

	return Object.entries(dailyForecasts)
		.map(([day, data], index) => {
			if (index === 0) return null;
			const dayOfWeek = new Date(day).toLocaleString("en-us", { weekday: "long" });
			const maxTemp = Math.max(...data.temps);
			const minTemp = Math.min(...data.temps);
			const icon = data.icons[Math.floor(data.icons.length / 2)];
			return { dayOfWeek, maxTemp: maxTemp.toFixed(1), minTemp: minTemp.toFixed(1), icon };
		})
		.filter(Boolean);
};

export { fetchWeatherCurrent, fetchWeatherForecast, processForecastData };
