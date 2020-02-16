// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var $temp = $("#temp");
var $humidity = $("#humidity");
var $wind = $("#wind");
var $search = $("#search");
var $searchBtn = $("#searchBtn");

// .on("click") function associated with the Search Button
// Create an AJAX call
$searchBtn.on("click", function(event){
    event.preventDefault();

    var search = $search.val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + search + "&appid=ec769fc248d61a50ac4a8124e2ff8391";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        $temp.text(response.main.temp);
        $humidity.text(response.main.humidity);
        $wind.text(response.wind.speed);
        console.log(response);
    });
})

