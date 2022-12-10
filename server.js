'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const db = require('./data/weather.json');
const app = express();
app.use(cors());
const weatherData = require('./data/weather.json');
const PORT = process.env.PORT || 3001;

const cache = require('./data/cache.js')
// get city that was searched
// check if city data is in the cache
//  if it is in the cache 
//      return object to front end as a response, 
//  if else 
// send request to API 
// save response to cache cache[cityName]=(seattleData)
// send response to front end

app.get('/weather', async (request, response, next) => {

    let lat = request.query.lat;
    let lon = request.query.lon;
    let key = 'weather' + lat + lon;

    if (cache[key]) {
        console.log('Cache hit!!!');
    } else {
        console.log('Cache miss!!!')
        let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=3`;
        cache[key] = {};
        let weatherResponse = await axios({
            method: 'GET',
            url: url,
        });
        console.log(weatherResponse.data)
        let weatherData = weatherResponse.data.data;
        try {
            let forecastArr = weatherData.map(day => new Forecast(day))
            cache[key].data= forecastArr
        } catch (err) {
            errorHandler(err, response);
        }
        console.log(cache[key].data)
    }
    response.send(cache[key].data);


});
function errorHandler(err, response) {
    console.log(err);
    response.status(500).send("Ooops you hit a wall")
}
function Forecast(day) {
    this.temp = day.temp;
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