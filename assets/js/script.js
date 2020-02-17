$(document).ready(function(){

var apiKey = "ec769fc248d61a50ac4a8124e2ff8391";
var $temp = $("#temp");
var $humidity = $("#humidity");
var $wind = $("#wind");
var $uv = $("#uv");
var $city = $("#city");
var $search = $("#search");
var $searchBtn = $("#searchBtn");
var $hide = $(".hide");


// .on("click") function associated with the Search Button

$searchBtn.on("click", function(event){
    event.preventDefault();

    $hide.display = "block";

    var search = $search.val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + search + "&appid=" + apiKey;
// Create an AJAX call to get current weather information
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        $city.text(response.name);
        $temp.text("Temperature: " + response.main.temp + " °F");
        $humidity.text("Humidity: " + response.main.humidity + " %");
        $wind.text("Wind Speed: " + response.wind.speed + " MPH");
        weatherIconUrl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
        weatherImage = $("<img>").attr("src", weatherIconUrl);
        $city.append(weatherImage)
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var uvIndexQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude;
// create another AJAX call to get UV Index information
        $.ajax({
            url: uvIndexQueryUrl,
            method: "GET"
        }).then(function(returned){
            $uv.text("UV Index: " + returned.value);
        })

// third AJAX call to get forecast information
        var forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + search + "&appid=" + apiKey + "&units=imperial"

        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        }).then(function(result){
            console.log(result);

    // temperature forecast - 5 days
            $("#forecastTemp1").text("Temp: " + result.list[0].main.temp);
            $("#forecastTemp2").text("Temp: " + result.list[1].main.temp);
            $("#forecastTemp3").text("Temp: " + result.list[2].main.temp);
            $("#forecastTemp4").text("Temp: " + result.list[3].main.temp);
            $("#forecastTemp5").text("Temp: " + result.list[4].main.temp);
    // humidity forecast - 5 days
            $("#forecastHumidity1").text("Humidity: " + result.list[0].main.humidity);
            $("#forecastHumidity2").text("Humidity: " + result.list[1].main.humidity);
            $("#forecastHumidity3").text("Humidity: " + result.list[2].main.humidity);
            $("#forecastHumidity4").text("Humidity: " + result.list[3].main.humidity);
            $("#forecastHumidity5").text("Humidity: " + result.list[4].main.humidity);
        })
    });

});

});