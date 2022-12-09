'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const db = require('./data/weather.json');
const app = express();
app.use(cors());
const weatherData = require ('./data/weather.json');
const PORT = process.env.PORT || 3001;


app.get('/weather', async (request, response, next) => {

    let lat = request.query.lat;
    let lon = request.query.lon;

    let url = `https://api.weatherbit.io/v2.0/current?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;

    let weatherResponse = await axios ({
        method: 'GET',
        url: url,
    });
    let weatherData = weatherResponse.data.data;
    response.send(weatherData);
    //   if (!request.query.name) {
    //     next('Please provide a valid city.'); // to handle an error on the server, pass any value into next.
    // let { searchQuery } = request.query;
    // const cityWeather = db.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase())
    // let arrDays = cityWeather.data;
    try{
    let forecastArr = arrDays.map(day => new Forecast(day))
    response.send(forecastArr);
}catch(err) {
    errorHandler(err,response);
}


});
function errorHandler(err,response) {
    console.log(err);
    response.status(500).send("Ooops you hit a wall")
}
function Forecast(day) {
    this.date = day.valid_date;
    this.description = day.weather.description;
}
app.use;
// catch all requests that don't match a METHOD or URL above.
app.use('*', (request, response, next) => {
    response.status(404).send('Invalid Request, route not found');
});

// class Forecast {
//     constructor(weather) {

//     }
// }

app.listen(PORT, () => console.log(`listening on ${PORT}`));