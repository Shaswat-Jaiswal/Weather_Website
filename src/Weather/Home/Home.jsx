import { useState, useEffect } from "react";
import { FaCloud } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { WiBarometer } from "react-icons/wi";
import { TiWeatherWindy } from "react-icons/ti";
import SunCalc from "suncalc";
import "./Home.css";
export const  Home = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState("Delhi"); 
    const [forecast, setForecast] = useState(null);
    const [moonTimes, setMoonTimes] = useState({ moonrise: null, moonset: null });

    const API_KEY = "650c33f8d5f09c4ee57304a3fe2bd400";

     const fetchWeather = async (cityName) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();
    setWeather(data);
  } catch (error) {
    console.log("Error fetching weather:", error);
  }
};

const fetchForecast = async (cityName) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();
    setForecast(data);
  };



    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

   useEffect(() => {
  if (city) {
    fetchWeather(city);
    fetchForecast(city);
  }
}, [city]);

useEffect(() => {
  if (weather?.coord) {
    const times = SunCalc.getMoonTimes(
      new Date(),
      weather.coord.lat,
      weather.coord.lon
    );
    setMoonTimes({ moonrise: times.moonrise, moonset: times.moonset });
  }
}, [weather]);

    const time = currentDateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

    const day = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const date = currentDateTime.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(/ /g, "");
  
const countries = { IN: "India", US: "United States", GB: "United Kingdom" };
  const countryName = weather?.sys?.country
    ? countries[weather.sys.country] || weather.sys.country
    : "";


 return( 
    <div className="a1">
        
        <img
        src="/images/weather.jpg"
        alt="weather"
        className="b1"
        />
        <div className="search-box">
            <input
            type="text"
            placeholder="search city..."
            className="c1"
            onKeyDown={(e) => {
           if (e.key === "Enter"){
            setCity(e.target.value); // state update
           }
            }}
            />
        </div>

        <div className="date-time">
        <h2>{time}</h2>
        <p>{day}, {date}</p>
      </div>

      <div className="location">
        <h3 className="d1">{countryName}</h3>
         <p>{weather?.name}</p>
      </div>

      <div className="cloud">
        <h2 className="d1">Today Details</h2>
        <FaCloud size={80} style={{ opacity: 0.9 }} color="white" />
        <h2 className="e1">
          {weather?.weather?.[0]?.description || "Loading..."}
          </h2>
        </div>

        <div className="f1">
          <h2 className="g1">Dry Temperature</h2>
          <h2 className="h1">{weather?.main?.temp || "--"}°C</h2>
          <h2 className="i1">High Temperature</h2>
          <h2 className="j1">{weather?.main?.temp_max || "--"}°C</h2>
        </div>

        <div className="line"></div>

        <div className="humidity">
         <WiHumidity size={60} className="hum-icon"  color="Blue"/>
         <span className="hum-text">Humidity (%)</span>
        <div className="hum-line"></div>
       <span className="hum-value">{weather?.main?.humidity || "--"}</span>
        </div>

        <div className="air">
         <WiBarometer size={60} className="air-icon"  color="Gray"/>
         <span className="air-text">Air Pressuure (nb)</span>
        <div className="air-line"></div>
       <span className="air-value">{weather?.main?.pressure || "--"}</span>
        </div>

        <div className="wind">
         <TiWeatherWindy size={60} className="wind-icon"  color="Purple"/>
         <span className="wind-text">Wind Speed(km/hr)</span>
        <div className="wind-line"></div>
        <span className="wind-value">{weather?.wind?.speed || "--"}</span>
        </div>

        <div className="astro-box">
  <div className="astro-item">
    <span className="astro-label">Sunrise</span>
    <span className="astro-time">
      {weather
              ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
    </span>
  </div>

  <div className="astro-item">
    <span className="astro-label">Sunset</span>
    <span className="astro-time">
      {weather
              ? new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
    </span>
  </div>
<div className="astro-item">
  <span className="astro-label">Moonrise</span>
  <span className="astro-time">
    {moonTimes.moonrise
      ? moonTimes.moonrise.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "--:--"}
  </span>
</div>

<div className="astro-item">
  <span className="astro-label">Moonset</span>
  <span className="astro-time">
    {moonTimes.moonset
      ? moonTimes.moonset.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "--:--"}
  </span>
</div>
</div>

<div className="hourly">
        <h3 className="hourly-title">Hourly Forecast (3 Hour Gap)</h3>

        <div className="hourly-row">
          {forecast?.list?.slice(0, 8).map((item, index) => (
            <div className="hour-card" key={index}>
              <span>
                {new Date(item.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>{item.weather[0].main}</span>
              <span>{Math.round(item.main.temp)}°C</span>
            </div>
          ))}
        </div>
      </div>
      </div>
 )
}