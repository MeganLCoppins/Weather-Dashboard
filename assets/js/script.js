$(document).ready(function() {
    var apiKey = "ec769fc248d61a50ac4a8124e2ff8391";
    var $temp = $("#temp");
    var $humidity = $("#humidity");
    var $wind = $("#wind");
    var $uv = $("#uv");
    var $city = $("#city");
    var $search = $("#search");
    var $searchBtn = $("#searchBtn");
    
    var searchArray = [];
    getSearch();

// on click event to grab search input $ display hidden div
    $searchBtn.on("click", function(event){
        event.preventDefault();

        $(".hide").removeClass("hide");
        searchBtnCall();
    });


// function built to create AJAX call from search form input
    function searchBtnCall(){
        var search = $search.val();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + search + "&appid=" + apiKey;
    // create AJAX call to get current weather information
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            $city.text(response.name);
            $temp.text("Temperature: " + response.main.temp + " °F");
            $humidity.text("Humidity: " + response.main.humidity + " %");
            $wind.text("Wind Speed: " + response.wind.speed + " MPH");
            weatherIconUrl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
            weatherImage = $("<img>").attr("src", weatherIconUrl);
            $city.append(weatherImage);
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var uvIndexQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + apiKey + "&lat=" + latitude + "&lon=" +   longitude;
        // create another AJAX call to get UV Index information
            $.ajax({
                url: uvIndexQueryUrl,
                method: "GET"
            }).then(function(returned){
                $uv.text("UV Index: " + returned.value);

                if(returned.value <= 2){
                    $uv.addClass("favorable");
                }
                if(returned.value > 2 && returned.value <= 7){
                    $uv.addClass("moderate");
                }
                if(returned.value > 7){
                    $uv.addClass("severe");
                }
            });
        // third AJAX call to get forecast information
            var forecastQueryUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + search + "&appid=" + apiKey + "&units=imperial"

            $.ajax({
                url: forecastQueryUrl,
                method: "GET"
            }).then(function(result){
                for(var i = 0; i < 6; i++){
                    $("#forecastTemp" + i).text("Temp: " + result.list[i].main.temp);
                    $("#forecastHumidity" + i).text("Humidity: " + result.list[i].main.humidity);
                }
            });
        });
    storeSearch();
    }

// function built to store search in localStorage
    function storeSearch(){
        var search = $search.val();
        // localStorage.setItem("search", JSON.stringify(search));
        searchArray.push($search.val());
    // set array to local storage
        localStorage.setItem("localSearch", JSON.stringify(searchArray));
    // return from function early if submitted search is blank
        if(search === ""){
            return;
        }
    // clear input from search form
        $search.val("");

        getSearch();
    };


// function built to get search from localStorage
    function getSearch() {
        var storedSearch = JSON.parse(localStorage.getItem("localSearch"));
    // clear out button area
        $("#listOfCities").empty();
    // run for loop to dynamically add div and button based on searchArray
        for(var i = 0; i < storedSearch.length; i++){
            var div = $("<div>");
            var button = $("<button>");
            button.attr("class", "btn-lg btn-block city").text(storedSearch[i]);
            button.attr("id", storedSearch[i]);

    // prepending div to DOM and appending button to div
        $("#listOfCities").prepend(div);
        div.append(button);
        }

// on click event for search history buttons
    $(".city").on("click", function(event){
        event.preventDefault();
        var search = $(this).text();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + search + "&appid=" + apiKey;
    
    // create AJAX call to get current weather
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            $city.text(response.name);
            $temp.text("Temperature: " + response.main.temp + " °F");
            $humidity.text("Humidity: " + response.main.humidity + " %");
            $wind.text("Wind Speed: " + response.wind.speed + " MPH");
            weatherIconUrl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
            weatherImage = $("<img>").attr("src", weatherIconUrl);
            $city.append(weatherImage);
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var uvIndexQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + apiKey + "&lat=" + latitude + "&lon=" +   longitude;
        // create another AJAX call to get UV index information
            $.ajax({
                url: uvIndexQueryUrl,
                method: "GET"
            }).then(function(returned){
                $uv.text("UV Index: " + returned.value);

                if(returned.value <= 2){
                    $uv.addClass("favorable");
                };
                if(returned.value > 2 && returned.value <= 7){
                    $uv.addClass("moderate");
                };
                if(returned.value > 7){
                    $uv.addClass("severe");
                };
            });
        });
    // third AJAX call to get forecast information
        var forecastQueryUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + search + "&appid=" + apiKey + "&units=imperial"

        $.ajax({
            url: forecastQueryUrl,
            method: "GET"
        }).then(function(result){
            for(var i = 0; i < 6; i++){
                $("#forecastTemp" + i).text("Temp: " + result.list[i].main.temp);
                $("#forecastHumidity" + i).text("Humidity: " + result.list[i].main.humidity);
            };
        });
    });
    };
});