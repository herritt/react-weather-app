import React, { useState } from "react";
import { fetchWeatherCurrent, fetchWeatherForecast, processForecastData } from "./WeatherService";
import "./App.css";

function App() {
	const [city, setCity] = useState("Halifax");
	const [currentWeather, setCurrentWeather] = useState(null);
	const [forecast, setForecast] = useState([]);

	const handleFetchWeather = async () => {
		try {
			const currentData = await fetchWeatherCurrent(city);
			console.log(currentData);
			setCurrentWeather(currentData);
			const forecastData = await fetchWeatherForecast(city);
			const dailyData = processForecastData(forecastData);
			setForecast(dailyData);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="weather-app">
			<div className="weather-inputs">
				<input
					type="text"
					value={city}
					onChange={(e) => setCity(e.target.value)}
					placeholder="Enter city name"
				/>
				<button onClick={handleFetchWeather}>Get Weather</button>
			</div>
			{currentWeather && (
				<div className="weather-container">
					<h2>Current Weather in {currentWeather.name}</h2>{" "}
					<img
						src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
						alt="weather icon"
					/>
					<p>Temperature: {currentWeather.main.temp} °C</p>
					<p>Condition: {currentWeather.weather[0].main}</p>
				</div>
			)}
			{forecast.length > 0 && (
				<div>
					<h2 className="forecast-title">5-Day Forecast for {currentWeather.name}</h2>
					<div className="forecast-container">
						{forecast.map((item, index) => (
							<div key={index} className="forecast-day">
								<p>{item.dayOfWeek}</p>
								<img
									src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
									alt="Weather icon"
								/>
								<p>High: {item.maxTemp} °C</p>
								<p>Low: {item.minTemp} °C</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
