const express = require('express');
const request = require('request');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// OpenWeather API Key
const apiKey = `7ec2db1da99de85db69c094877707c1c`;

app.get('/', (req, res) => {
    
    res.render('index', { weather: null, error: null });
})

app.post('/', function (req, res) {
    let cityName = req.body.cityName;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    if(!cityName){
        return res.render('index', { weather: null, error: 'Please enter a location.' });
    }
    
    request(url, (err, response, body) => {
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            let weather = JSON.parse(body)
            if (weather.main == undefined) {
                cityName =cityName.replace(/\b\w/g, s => s.toUpperCase())
                res.render('index', { weather: null, error: `Unable find the data for ${cityName}, please try for another location` });
            } else {
                let temp=(weather.main.temp-273.15).toFixed(2) +String.fromCharCode(176);
                let weatherCondition = weather.weather[0].description;
                let place = weather.name;
                let monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let date =new Date().getDate();
                if(date<10){
                    date="0"+date;
                }
                let mainWeatherCondition= weather.weather[0].main.toLowerCase();
                date = date+ " "+ monthsName[new Date().getMonth()];
                let weatherIcon="http://openweathermap.org/img/wn/"+ weather.weather[0].icon +"@2x.png";
                res.render('index', { weather: {temp:temp,mainWeatherCondition:mainWeatherCondition, weatherCondition:weatherCondition, place:place, date:date,weatherIcon:weatherIcon}, error: null });
                
            }
        }
    });
    
})




app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`)
});