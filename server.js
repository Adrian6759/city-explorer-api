'use strict';

const express = require('express');
const cors = require('cors');
const db = require('./data/weather.json');

// this is a singleton, meaning there can only one!
const app = express(); // starts the framework, now we have to configure the object the framework returns.
app.use(cors());

const PORT = process.env.PORT|| 3001;

// specify a METHOD,  provide an endpoint for the URL
app.get('/weather', (request, response, next) => {
  // do something in response!
  console.log(request.query, db);
//   if (!request.query.name) {
//     next('Please provide a valid city.'); // to handle an error on the server, pass any value into next.
    
//   } else {
    // find our weather
    // let weatherData = {};
    let {searchQuery}=request.query;
    const cityWeather = db.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase())
    response.send(cityWeather);
    // }
  });

// catch all requests that don't match a METHOD or URL above.
app.use('*', (request, response, next) => {
  response.status(404).send('Invalid Request, route not found');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));