// Global variables
let myKey = '681b0f108bf4df4dd669593f20442c50'
// let description = response.weather[0].description;

// Query APIs based on DOM search term
$("#search-btn").on("click", function() {
    let query = $('#search-box')
        .val()
        .trim();

    // Build the url to query the weather API
    let weatherQueryURL = `http://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=${myKey}`;
    $.ajax({
        url: weatherQueryURL,
        method: "GET"
    }).then(function (response){
        console.log(response)
        $("#location").text(response.name);
        $("#degrees").text("Temp: " + response.main.temp + " F");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#description").text("Current Conditions: " + response.weather[0].description);
        let lon = response.coord.lon;
        let lat = response.coord.lat;
        console.log(lon);
        console.log(lat);
        buildForecastQueryURL(query);
        buildUVQueryURL(query, lon, lat);
    })
})

function buildForecastQueryURL(query) {
    // Build the url to query forecast API
    let forecastQueryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&appid=${myKey}`;
    $.ajax({
        url: forecastQueryURL,
        method: "GET"
    }).then(function (response){
        console.log(response);
        let date = response.list[i].dt_txt.substring(0,10);
        renderForecast(date); 
    })
}

function buildUVQueryURL(query, lon, lat) {
    // Build the url to query UV API
    let uvQueryURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${myKey}`;
    $.ajax({
        url: uvQueryURL,
        method: "GET"
    }).then(function (response){
        console.log(response);
        $("#uv-index").text("UV Index: " + response.value);
    })
}

function renderForecast(date) {
    // populate 5-day forecast cards
    for (let i=0; i < 40; i+=8) {
        
        let row = $("<div/>", {
           "id" : "forecast-boxes" 
        }).appendTo("#forecast");

        let dateTag = $("<h2/>", {
            "class" : "date",
            "text" : date
        }).appendTo(row);

        let icon = $("<i/>", {
            "class" : "wi-owm-" + response.weather[0].id,
            "alt" : description,
        }).appendTo(row);
    }
}

