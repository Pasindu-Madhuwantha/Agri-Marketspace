import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import "./WeatherApp.css";
import Autosuggest from "react-autosuggest";
import Loader from '../layout/Loader';
import Sidebar from "../seller/Sidebar";

const API_KEY = "fd51e8a9c1288930a45c4b779a674ca1";

const WeatherApp = () => {
    const [location, setLocation] = useState("");
    const [weatherData, setWeatherData] = useState({});
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
                );
                setWeatherData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (location !== "") {
            fetchWeatherData();
        }
    }, [location]);

    const handleLocationChange = (event, { newValue }) => {
        setLocation(newValue);
    };

    const getSuggestions = async (value) => {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/find?q=${value}&type=like&sort=population&appid=${API_KEY}`
        );
        const locations = response.data.list.map((result) => result.name);
        return locations;
    };

    const onSuggestionsFetchRequested = async ({ value }) => {
        const suggestions = await getSuggestions(value);
        setSuggestions(suggestions);
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const getSuggestionValue = (suggestion) => suggestion;

    const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

    const inputProps = {
        placeholder: "Enter Location",
        value: location,
        onChange: handleLocationChange,
    };

    return (
        <Fragment>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                 
                <div className="weather-app">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                    />
                        <br></br>
                    {Object.keys(weatherData).length > 0 ? (
                        <div>
                            <h1>{weatherData.name}</h1>
                            <p>Temperature: {weatherData.main.temp}°C</p>
                            <p>Weather Condition: {weatherData.weather[0].description}</p>
                        </div>
                    ) : (
                        <Loader />
                    )}
                </div>
                
                </div>
            </div>
        </Fragment>
    );
};

export default WeatherApp;
