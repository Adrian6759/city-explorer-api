'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const superagent = require('superagent');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const db = require('./data/weather.json');
const app = express();
app.use(cors());
const weatherData = require('./data/weather.json');
const PORT = process.env.PORT || 3001;

const cache = require('./data/cache.js')

app.get('/weather', async (request, response, next) => {

    let lat = request.query.lat;
    let lon = request.query.lon;
    let key = 'weather' + lat + lon;

    if (cache[key]) {
        console.log('Cache hit!!!');
    } else {
        console.log('Cache miss!!!')
        let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=3`;
        console.log(url);
        cache[key] = {};
        let weatherResponse = await axios({
            method: 'GET',
            url: url,
        });
        console.log(weatherResponse.data)
        let weatherData = weatherResponse.data.data;
        try {
            let forecastArr = weatherData.map(day => new Forecast(day))
            cache[key].data = forecastArr
        } catch (err) {
            errorHandler(err, response);
        }
        console.log(cache[key].data)
    }
    response.send(cache[key].data);


});
app.get('/movies', async (request, response, next) => {

    let { searchQuery } = request.query;
    let url = `https://api.themoviedb.org/3/search/movie/?api_key=${MOVIE_API_KEY}&query=${searchQuery}&page=1`;
    console.log(url);
    let resultsArr = [];
    try {
        let movieResponse = await superagent.get(url);
        let movieData = movieResponse._body;
        movieData.results.map(movie => resultsArr.push(new Movie(movie)));
        console.log('this is the data', resultsArr);
        response.send(resultsArr);
    } catch (err) {
        errorHandler(err, response);
    }
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
class Movie {
    constructor(data) {
        this.title = data.original_title;
        this.overview = data.overview;
        this.avg = data.vote_average;
        this.total = data.vote_count;
        this.popularity = data.popularity;
        this.release = data.released_on;
        console.log(this.title,this.overview,this.avg,this.total);
    }

}
app.use;
app.use('*', (request, response, next) => {
    response.status(404).send('Invalid Request, route not found');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
