/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {
    "use strict";

    var baseUrl = document.location.href;
    baseUrl = baseUrl.replace('weather-search.html', '');
    
    var cityInput = $('tr#inputCityRow td input');
    
    $('tr#inputCityRow td input').keyup(function () {
        var inputVal = cityInput.val();
	if (inputVal != "") {
            $.ajax(baseUrl + "getcity?q=" + inputVal, {
                'method': 'get',
                'dataType': 'json',
                'success': function (data) {
                    $('tr td ul.suggestions li').remove();
                    $.each(data, function (i, cityEntry) {
		        var cityName = cityEntry['city'];
                        $('tr td ul.suggestions').append($('<li>', {text: cityName}));
                    });
                },
                'error': function (data) {
                    $('tr td ul.suggestions li').remove();
                }
            });
	} else {
            $('tr td ul.suggestions li').remove();
	}
    });
    
    $('form#cityZipSearch').submit(function (event) {
        event.preventDefault();
        
        var city = cityInput.val();
        $('table#formTable tr td textarea').val(city);
    
        $('tr td ul.weather li').remove();
        
        if (city != "") {
            var weatherAjaxUrl = "https://api.wunderground.com/api/8dc54358cb849160/conditions/q/Utah/" + city + ".json";
	    $.ajax({
                'url': weatherAjaxUrl,
                'method': 'get',
                'dataType': 'jsonp',
                'success': function (data) {
                    console.log(data);
                    if (!data['response'].hasOwnProperty('error')) {
                        var location = data['current_observation']['display_location']['full'];
                        var temperature = data['current_observation']['temperature_string'];
                        var weather = data['current_observation']['weather'];
                        console.log(location + " " + temperature + " " + weather);
                        $('tr td ul.weather').append($('<li>', {text: "Location: " + location}));
                        $('tr td ul.weather').append($('<li>', {text: "Temperature: " + temperature}));
                        $('tr td ul.weather').append($('<li>', {text: "Weather: " + weather}));
                    } else {
                        var errorMessage = data['response']['error']['description'];
                        $('tr td ul.weather').append($('<li>', {text: errorMessage}));
                    }
                },
                'error': function (data) {
                    $('tr td ul.weather').append($('<li>', {text: "'" + city + "' not a valid location"}));
                }
            });
        }
    });
});
