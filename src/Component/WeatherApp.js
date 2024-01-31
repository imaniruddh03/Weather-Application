import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Style.css'; // Import the CSS file

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [unit, setUnit] = useState('metric'); // default to Celsius

  const API_KEY = 'd1845658f92b31c64bd94f06f7188c9c';

  const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const dayInWeek = new Date().getDay();
    const forecastDays = WEEK_DAYS.slice(dayInWeek, WEEK_DAYS.length).concat(
        WEEK_DAYS.slice(0, dayInWeek)
    );

  const determineBackgroundImage = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) {
      return 'url(path-to-thunderstorm-image)';
    } else if (weatherId >= 300 && weatherId < 600) {
      return 'url(https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fcategory%2Fweather%2Frain&psig=AOvVaw3QAq36d7MgHC05gjaUBiK3&ust=1706642184530000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCNjojtyng4QDFQAAAAAdAAAAABAE)';
    } else if (weatherId >= 600 && weatherId < 700) {
      return 'url(path-to-snow-image)';
    } else if (weatherId >= 700 && weatherId < 800) {
      return 'url(path-to-atmosphere-image)';
    } else if (weatherId === 800) {
      return 'url(path-to-clear-sky-image)';
    } else if (weatherId > 800 && weatherId < 900) {
      return 'url(path-to-clouds-image)';
    } else {
      return 'url(path-to-default-image)';
    }
  };

  useEffect(() => {
    if (weatherData) {
      const backgroundImage = determineBackgroundImage(weatherData.weather[0].id);
      document.documentElement.style.setProperty('--background-image', backgroundImage);
    }
  }, [weatherData]);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`);
      setWeatherData(response.data);
    } catch (error) {
      alert('Error fetching weather data:', error);
    }
  };

  const fetchForecastData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`);
      const filteredData = response.data.list.filter((item, index, array) => {
        const currentDate = item.dt_txt.split(' ')[0];
        return array.findIndex((elem) => elem.dt_txt.split(' ')[0] === currentDate) === index;
      });
      setForecastData(filteredData);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const handleUnitChange = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div className="container">
      <div className="box1">
        <div className="weather-info">
          <div className="search-container">
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" className="search-input" />
            <button onClick={() => {fetchWeatherData(); fetchForecastData();}} className="search-button">Search</button>
            <button onClick={handleUnitChange} className="toggle-button">Toggle Unit</button>
          </div>
            <div className="city-temp-detail">
                {weatherData && (
                  <div className="weather-card">
                    <h2>Current Weather</h2>
                    <div className="weather-details">
                      <div className="weather-detail-degree">
                        <p className='degree'>{weatherData.main.temp} {unit === 'metric' ? '' : '°F'}
                          <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt="weather icon" />
                        </p>
                        <p className='weather-des'>{weatherData.weather[0].description}</p>
                        <div className="low-high">
                          <p>L: {weatherData.main.temp_min} {unit === 'metric' ? '°C' : '°F'}</p>
                          <p>H: {weatherData.main.temp_max} {unit === 'metric' ? '°C' : '°F'}</p>
                        </div>
                      </div>
                      <div className="weather-detail-about">
                        <div className="humidity">
                          <p className='humid'>Humidity: </p>
                          <p>{weatherData.main.humidity}%</p>
                        </div>
                        <div className="wind-speed">
                          <p className='w-s'>Speed:</p>
                          <p>{weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
                        </div>
                        <div className="wind-direction">
                          <p className='w-d'> Direction:</p>
                          <p> {weatherData.wind.deg}°</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
            </div>
            {forecastData && (
          <div className="forecast-container">
            <h2>5-Day Forecast</h2>
            <div className="forecast">
              {forecastData.map((item, index) => (
                <div key={index} className="forecast-item">
                  <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="weather icon" />
                  <p>{forecastDays[index]}</p>
                  <p>{Math.round(item.main.temp_max)}°C | {Math.round(item.main.temp_min)}°C</p>
                  <p>{item.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>

        

      </div>
    </div>
  );
};

export default WeatherApp;





