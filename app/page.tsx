"use client";
import { useState } from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiHumidity,
  WiStrongWind,
} from "react-icons/wi";

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWeather = async () => {
    if (!city.trim()) return alert("Enter a city name!");
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${city}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      alert("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (main: string) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny className="text-yellow-400 text-7xl" />;
      case "Clouds":
        return <WiCloudy className="text-gray-400 text-7xl" />;
      case "Rain":
        return <WiRain className="text-blue-400 text-7xl" />;
      case "Snow":
        return <WiSnow className="text-sky-200 text-7xl" />;
      case "Thunderstorm":
        return <WiThunderstorm className="text-yellow-600 text-7xl" />;
      default:
        return <WiFog className="text-gray-500 text-7xl" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-200 to-sky-500 text-gray-800 font-sans">
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg text-white">
        🌤 Weather Forecast
      </h1>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-3 w-64 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {weather && weather.main && (
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center w-80 transition-transform hover:scale-105">
          <div className="mb-4 flex justify-center">
            {getWeatherIcon(weather.weather[0].main)}
          </div>

          <h2 className="text-3xl font-bold mb-2">{weather.name}</h2>
          <p className="capitalize text-gray-700 mb-4 text-lg">
            {weather.weather[0].description}
          </p>

          <p className="text-5xl font-extrabold mb-4">
            {(weather.main.temp - 273.15).toFixed(1)}°C
          </p>

          <div className="flex justify-around text-gray-700 mt-4">
            <div className="flex flex-col items-center">
              <WiHumidity className="text-3xl text-blue-500" />
              <p className="text-sm">Humidity</p>
              <p className="font-semibold">{weather.main.humidity}%</p>
            </div>
            <div className="flex flex-col items-center">
              <WiStrongWind className="text-3xl text-green-500" />
              <p className="text-sm">Wind</p>
              <p className="font-semibold">{weather.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
