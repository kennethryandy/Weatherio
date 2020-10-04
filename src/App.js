import React, { useEffect, useState } from "react";
import { dateBuilder } from "./helpers/dateBuilder";
import "./styles.css";
import loadingSvg from "./assets/loading.svg";

export default function App() {
  const API_KEY = "c2015c0d970858be763ccc21b3e20531";
  const [datas, setDatas] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("");
  const [tempe, setTempe] = useState(0);
  const [weather, setWeather] = useState({
    main: "",
    desc: "",
  });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(currentLocation);
    } else {
      console.log("error");
    }
  }, []);

  const currentLocation = async ({ coords: { latitude, longitude } }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      const json = await response.json();
      const data = json.list[0];
      setDatas(data);
      setCountry(data.sys.country);
      const tempTempe = Math.floor(Math.round(data.main.temp - 273.15));
      setTempe(tempTempe);
      setWeather({
        main: data.weather[0].main,
        desc: data.weather[0].description,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${API_KEY}`
      );
      const data = await response.json();
      setDatas(data);
      setCountry(data.sys.country);
      const tempTempe = Math.floor(Math.round(data.main.temp - 273.15));
      setTempe(tempTempe);
      setWeather({
        main: data.weather[0].main,
        desc: data.weather[0].description,
      });
      setLoading(false);
    } catch {
      alert("Invalid country name");
      setDatas((prev) => {
        return { ...prev, name: datas.name };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
    if (datas.name === input) {
      setInput("");
    } else {
      setInput("");
    }
  };

  const handleSearch = (e) => {
    let name = e.target.value;
    setInput(name);
  };

  return loading ? (
    <div className="loading">
      <img src={loadingSvg} />
    </div>
  ) : (
    <div className="app">
      <main>
        <div className="search-box">
          <form onSubmit={handleSubmit}>
            <div className="form-input">
              <i className="fa fa-search" aria-hidden="true" />
              <input
                className="search-bar"
                type="text"
                onChange={handleSearch}
                value={input}
                placeholder="Search Location..."
              />
            </div>
            <button type="submit" style={{ display: "none" }}></button>
          </form>
        </div>

        <div className="location-box">
          <div className="location">
            <h3>
              {datas.name}, {country}
            </h3>
          </div>
          <div className="date">{dateBuilder(new Date())}</div>
        </div>
        <div className="weather-box">
          <div className="temp">{tempe}°c</div>
          <div className="weather">{weather.main}</div>
          <div className="weather-subtitle">"{weather.desc}"</div>
        </div>
      </main>
    </div>
  );
}
