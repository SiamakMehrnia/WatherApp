import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { weatherMapping } from "./weathermapping";

function Weather() {
  const [location, setLocation] = useState("New York"); // Default location
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (!weatherData) {
    return <div className="text-center text-xl">No data found</div>;
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

  const bgIcon = weatherData?.current?.condition?.code && weatherMapping[weatherData.current.condition.code]
  ? weatherMapping[weatherData.current.condition.code].lottie
  : weatherData?.current?.condition?.icon; 

const bg = weatherData?.current?.condition?.code && weatherMapping[weatherData.current.condition.code]
  ? weatherMapping[weatherData.current.condition.code].bgColor
  : "gray"; 

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundColor: bg,
      }}
    >
      {bgIcon && (
        <img
          src={bgIcon}
          alt="Weather Icon"
          className="absolute top-0 w-64 h-4w-64 mx-auto md:right-52 "
        />
      )}
      <div className="max-w-md mx-auto mt-10 p-8 min-w-96 backdrop-blur-sm bg-white/30 rounded-xl shadow-md relative z-10">
        <SearchBar onSearch={handleSearch} />

        <div className="text-center text-white">
          <h1 className="text-2xl font-bold">
            {name}, {country}
          </h1>
          <img src={bgIcon} alt={text} className="mx-auto w-10 mt-3 " />
          <p className="text-xl">{text}</p>
          <p className="text-3xl font-bold">{temp_c}°C</p>
          <div className=" flex justify-evenly mt-5">
            <div className="flex justify-center items-center gap-1">
              <img src="/humidity.svg" alt="humidity" className="w-16" />
              <p className="text-xl">{humidity}%</p>
            </div>
            <div className="flex justify-center items-center gap-1">
              <img src="/wind.svg" alt="humidity" className="w-16" />
              <p className="text-xl">{wind_kph}kph</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
