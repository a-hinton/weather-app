// Global variables
let myKey = '681b0f108bf4df4dd669593f20442c50';
let pastSearch = localStorage.getItem("city") ? JSON.parse(localStorage.getItem("city")) : []
let searchHistory = $(".pastSearches")

// Initialize page
$(document).ready(function() {
    // Retrieve local storage data
    if (pastSearch.length === 0) {
        queryWeatherAPI('Austin');
    }

    else {
        queryWeatherAPI(pastSearch[pastSearch.length-1])
    };

    // Display past searches
    renderPastSearches();    
})

// Query APIs based on DOM search term
$("#search-btn").on("click", function() {
    let query = $('#search-box')
        .val()
        .trim();

    pastSearch.push(query);
    localStorage.setItem("city", JSON.stringify(pastSearch));
    queryWeatherAPI(query);
    renderPastSearches();
})

function queryWeatherAPI(query) {
    // Build the url to query the weather API
    $("#forecast").empty();
    let weatherQueryURL = `http://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=${myKey}`;
    $.ajax({
        url: weatherQueryURL,
        method: "GET"
    }).then(function(response) {
        renderCurrentWeather(response, query)
    });
}


function buildForecastQueryURL(query) {
    // Build the url to query forecast API
    let forecastQueryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&appid=${myKey}`;
    $.ajax({
        url: forecastQueryURL,
        method: "GET"
    }).then(function (response){
        renderForecast(response); 
    })
}

function buildUVQueryURL(lon, lat) {
    // Build the url to query UV API
    let uvQueryURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${myKey}`;
    $.ajax({
        url: uvQueryURL,
        method: "GET"
    }).then(function (response){
        renderUV(response);
    })
}

function renderCurrentWeather (response, query) {
    // Populate today's weather conditions
    let test = moment().format("dddd, MMMM Do YYYY");

    $("#location").text(response.name + " " + test);
    $("#today-date").text(test);
    $("#current-weather-sym").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png")
    $("#degrees").text("Temp: " + response.main.temp + "° F");
    $("#humidity").text("Humidity: " + response.main.humidity + "%");
    $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
    $("#description").text("Current Conditions: " + response.weather[0].description);
    let lon = response.coord.lon;
    let lat = response.coord.lat;
    
    // Call follow-up functions
    buildForecastQueryURL(query);
    buildUVQueryURL(lon, lat);
}

function renderUV(response) {
    // Populate UV index data and change color based on rating
    if(response.value < 3) {
        $(".uv-index").prop('id', 'uv-index-low');
    }
    else if (response.value < 6) {
        $(".uv-index").prop('id', 'uv-index-mod');
    }
    else if (response.value >= 6) {
        $(".uv-index").prop('id', 'uv-index-high');
    }
    $(".uv-index").text(response.value);
}

function renderForecast(response) {
    // populate 5-day forecast cards
    for (let i=0; i < 40; i+=8) {
        let date = response.list[i].dt_txt.substring(0,10);
        let iconCode = response.list[i].weather[0].icon;

        // render elements in box headers
        let row = $("<div/>", {
           "id" : `forecast-card${i}`,
           "class" : "forecast-card borders",
        }).appendTo("#forecast");

        let card = $("<div/>", {
            "id" : `forecast-header${i}`,
            "class" : "forecast-header", 
         }).appendTo(row);

        let dateTag = $("<h3/>", {
            "class" : "date",
            "text" : date
        }).appendTo(card);

        let icon = $("<img/>", {
            "class" : "weather-icon",
            "alt" : response.list[i].weather[0].description,
            "src" : "http://openweathermap.org/img/w/" + iconCode + ".png"
        }).appendTo(card);

        // Render elements in conditions
        let conditions = $("<div/>", {
            "id" : `condition-box${i}`,
            "class" : "condition-boxes", 
         }).appendTo(row);

        let temperature = $("<p/>", {
            "class" : "temp",
            "text" : "T: " + response.list[i].main.temp + "° F"
        }).appendTo(conditions);

        let hum = $("<p/>", {
            "class" : "humidity",
            "text" : "Humidity: " + response.list[i].main.humidity + "%"
        }).appendTo(conditions);

    }
}

function renderPastSearches() {
    $("#past-searches").empty();
    
    for (let i = 1; i < 6; i++) {
        let pastSearchBox = $("<div/>", {
            "id" : `pastSearch${pastSearch.length - i}`,
            "class" : "pastSearches",
            "text" : pastSearch[pastSearch.length - i]
        }).appendTo("#past-searches");
    }
}

$(document).on('click',".pastSearches", function(){
    queryWeatherAPI($(this).text());
})
