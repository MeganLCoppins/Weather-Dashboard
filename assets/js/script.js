$(document).ready(function () {
  let searchArray = localStorage.getItem("localSearch");
  if (searchArray) {
    searchArray = JSON.parse(searchArray);
  } else {
    searchArray = [];
  }

  getSearch();

  // on click event to grab search input & display hidden div
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    let search = $("#search").val();
    $(".hide").removeClass("hide");
    $(".show").addClass("hide");
    $(".forecastHide").removeClass("forecastHide");

    storeSearch(search);
    getWeather(search);
  });

  // function built to create AJAX call from search form input
  function getWeather(search) {
    const queryURL =
      "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" +
      search +
      "&appid=ec769fc248d61a50ac4a8124e2ff8391";
    // create AJAX call to get current weather information
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      const dateString = moment.unix(response.dt).format("MM/DD/YYYY");
      $("#date").text(dateString);
      $("#city").text(response.name);
      $("#temp").text(response.main.temp + " °F");
      $("#humidity").text("Humidity: " + response.main.humidity + " %");
      $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");
      weatherIconUrl =
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      weatherImage = $("<img>").attr("src", weatherIconUrl);
      $("#city").append(weatherImage);
      const latitude = response.coord.lat;
      const longitude = response.coord.lon;
      const uvIndexQueryUrl =
        "https://api.openweathermap.org/data/2.5/uvi?&appid=ec769fc248d61a50ac4a8124e2ff8391" +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;
      // create another AJAX call to get UV Index information
      $.ajax({
        url: uvIndexQueryUrl,
        method: "GET",
      }).then(function (returned) {
        const button = $("<button>");
        button.text(returned.value);
        $("#uv").text("UV Index: ");

        if (returned.value <= 2) {
          button.addClass("favorable");
        } else if (returned.value > 2 && returned.value <= 7) {
          button.addClass("moderate");
        } else if (returned.value > 7) {
          button.addClass("severe");
        }
        $("#uv").append(button);
      });
      // third AJAX call to get forecast information
      const forecastQueryUrl =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        search +
        "&appid=ec769fc248d61a50ac4a8124e2ff8391" +
        "&units=imperial";

      $.ajax({
        url: forecastQueryUrl,
        method: "GET",
      }).then(function (result) {
        let day = 1;
        result.list.forEach(function (data) {
          if (data.dt_txt.includes("15:00")) {
            $("#Day" + day).text(moment.unix(data.dt).format("MM/DD/YYYY"));
            $("#forecastSymbol" + day).attr(
              "src",
              "https://openweathermap.org/img/w/" +
                data.weather[0].icon +
                ".png"
            );
            $("#forecastTemp" + day).text(data.main.temp + "°F");
            $("#forecastHumidity" + day).text(
              "Humidity: " + data.main.humidity + "%"
            );
            day++;
          }
        });
      });
    });
  }

  // function built to store search in localStorage
  function storeSearch(search) {
    // return from function early if submitted search is blank or the item already exists inside of the array
    if (search === "" || searchArray.includes(search)) {
      return;
    }
    // localStorage.setItem("search", JSON.stringify(search));
    searchArray.push(search);
    // set array to local storage
    localStorage.setItem("localSearch", JSON.stringify(searchArray));
    // clear input from search form
    $("#search").val("");

    getSearch();
  }

  // function built to get search from localStorage
  function getSearch() {
    // clear out button area
    $("#listOfCities").empty();
    // run for loop to dynamically add div and button based on searchArray
    for (var i = 0; i < searchArray.length; i++) {
      const div = $("<div>");
      const button = $("<button>");

      button.attr("class", "btn-lg btn-block city").text(searchArray[i]);
      button.attr("id", searchArray[i]);

      // prepending div to DOM and appending button to div
      $("#listOfCities").prepend(div);
      div.append(button);
    }
  }
  // on click event to show cities information
  $("#listOfCities").on("click", ".city", function (e) {
    e.preventDefault();
    const search = $(this).text();
    $(".hide").removeClass("hide");
    $(".show").addClass("hide");
    $(".forecastHide").removeClass("forecastHide");
    getWeather(search);
  });
  // on click event to clear search history
  $("#clear").on("click", function (e) {
    e.preventDefault();
    // set to empty array
    searchArray = [];
    // clear button area
    $("#listOfCities").empty();
    // clear local storage
    localStorage.clear();
  });
});
