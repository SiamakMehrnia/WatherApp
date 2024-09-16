import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

function Weather() {
  const [location, setLocation] = useState("New York"); // Default location
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`
        );
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        setWeatherData(data);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setWeatherData(null);
      }
    };

    fetchWeather();
  }, [location]);

  const handleSearch = (loc) => {
    setLocation(loc);
  };

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  if (!weatherData) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  const {
    current: {
      temp_c,
      condition: { text, icon },
      humidity,
      wind_kph,
    },
    location: { name, country },
  } = weatherData;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <SearchBar onSearch={handleSearch} />

      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {name}, {country}
        </h1>
        <img src={icon} alt={text} className="mx-auto" />
        <p className="text-xl">{text}</p>
        <p className="text-3xl font-bold">{temp_c}°C</p>
        <div className="flex justify-center space-x-4 mt-4">
          <p>💧 {humidity}%</p>
          <p>💨 {wind_kph} kph</p>
        </div>
      </div>
    </div>
  );
}

export default Weather;
