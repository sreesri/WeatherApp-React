import "./App.css";
import searchIcon from "./assets/magnifying-glass.png";
import clearIcon from "./assets/sun.png";
import cloudIcon from "./assets/clouds.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import windIcon from "./assets/wind.png";
import stromIcon from "./assets/storm.png";
import humidityIcon from "./assets/water.png";
import { useState } from "react";
import { useEffect } from "react";

const Weatherdetails = ({
  image,
  temp,
  city,
  country,
  lat,
  long,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={image} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">lattitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lat">longitude</span>
          <span>{long}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="value">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="value">{wind} km/h</div>
          <div className="text">Wind speed</div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [image, setImage] = useState(clearIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [wind, setWind] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [inputText, setInputText] = useState("Chennai");

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    search();
  }, []);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": clearIcon,
    "02n": clearIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": stromIcon,
    "13n": stromIcon,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputText}&appid=888917262aa4e6ec74d89a05ea58e232&units=Metric`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLong(data.coord.lon);

      const iconCode = data.weather[0].icon;
      setImage(weatherIconMap[iconCode] || clearIcon);
      setLoading(false);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occured", error.message);
      setError(error.message);
    } finally {
    }
  };

  const handleCity = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search();
  };
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            value={inputText}
            onChange={handleCity}
            onKeyDown={handleKeyDown}
            placeholder="Search City"
          />
          <div className="search-icon" onClick={() => search()}>
            <img src={searchIcon} alt="search" />
          </div>
        </div>

        {!loading && !cityNotFound && !error && (
          <Weatherdetails
            image={image}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            long={long}
            wind={wind}
            humidity={humidity}
          />
        )}

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
      </div>
    </>
  );
}

export default App;
