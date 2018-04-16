const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const urlencodedParser = bodyParser.urlencoded({ extended: false});

var app = express();

hbs.registerPartials(__dirname + '/views/partials')

app.set('views', './views')
app.set('view engine', 'hbs');

var getImage = (searchImage) => {
	return new Promise((resolve, reject) => {
		request({
			url: `https://pixabay.com/api/?key=7246674-b37ac3e55b379cef1f626bb09&q=${searchImage}&image_type=photo`,
			json: true
		}, (error, response, body) => {
			console.log(response);
			if (error) {
				reject('Error: ', error);
			} else {
				resolve(console.log(body));
			}
		})
	})
}

var geocode = (address) => {
    return new Promise((resolve, reject) => {
    	request({
    		url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' +
            encodeURIComponent(address),
        	json: true
    	}, (error, response, body) => {
	        if (error) {
	            reject('Cannot connect to Google Map');
	        } else if (body.status == 'OK') {
	            resolve({
	                loc: body.results[0].formatted_address,
	                lat: body.results[0].geometry.location.lat,
	                lng: body.results[0].geometry.location.lng
	            });
	        }
	    });
    });
};

var getWeather = (loc, lat, long) => {
	return new Promise((resolve, reject) => 
	    request({
	        url: 'https://api.darksky.net/forecast/1b588aea3161f1fc6a3cfc3747ef8a0d/' +
	            lat + ',' + long,
	        json: true
	    }, (error, response, body) => {
	        resolve(body);
	    })
	);
};

// temp var for testing.
var searchkeyword = 'flower';
app.get('/', (request, response) => {
	response.render('index.hbs');
	// getImage(searchkeyword); //just to test
})

app.get('/gallery', (request, response) => {
	response.render('gallery.hbs')
})

app.post('/gallery', urlencodedParser, (request, response) => {
	response.render('gallery.hbs')
	console.log(request);
	response.redirect('/gallery');
})

app.get('/weather', (request, response) => {
	response.render('weather.hbs')
})

app.listen(8080, () => {
	console.log('Server is up on port 8080...');
})