const currentTemp = $('#currentTemp');
const currentHumidity = $('#currentHumidity');
const cardContainer = $('#cardContainer')
const currentWind =  $('#currentWind');
const cityTitle = $('#cityTitle');
const titleIcon = $('#titleIcon');
const apiKey = "339169be96f8b23aa553a475404500fd";
const metric =  "&#8451";
const windMetric =  " MPH";
const imperial = "&#8457";
var city = "";
var units = "metric";
var cityData = [
    {city: ''},
    {lon: 0},
    {lat: 0}
];

// Prompt that allows user to enter city as search term

$('#searchButton').on("click", function(){
    var searchTerm = $('#searchBox').val();
    city = searchTerm.trim();

    if(city == "") {
        // Validate if search box empty or contains illegal characters (numbers & special characters)
        alert("You must enter a search term")
        return;
    };

    getGeo();
    // Timeout gives the GRO API time to return a result and reduce the API demand on the Weather API
    setTimeout(() => {
        getForecast();
    }, 150);

});

// Use Geography API to convert city into longitude and latitude

function getGeo() {

    var geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid="+ apiKey;
    
    $.ajax ({
        url: geoURL,
        method: "GET"
        
    }).then(function(response) {

    // Building search city result as an object for use in search history

    cityData[0].city = response[0].name;
    cityData[1].lon = response[0].lon;
    cityData[2].lat = response[0].lat;

    });

};


// Send weather query url to api and GET result

function getForecast() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=" + units + "&lat=" + cityData[2].lat + "&lon=" + cityData[1].lon + "&appid=" + apiKey;

    $.ajax ({
    url: queryURL,
    method: "GET"
        
    }).then(function(response) {
        // Globe is returned when the GEO API hasn't finished so IF statement ensures data displayed will never be Globe
        if (response.name == "Globe") {
            cityTitle.text("Fetching weather data...");

            // Timeout is to prevent excessive calls to the API. There is already 150ms further up so this is an added measure
            setTimeout(() => {
                getForecast();
            }, 150);

        } else {

        // Update Today's forecast: Compile Icon data
        var iconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

        // Add City Name, Date and Icon to Title Text
        cityTitle.text(`${response.name} ${moment.unix(response.dt).format("DD/MM/YYYY")} ${titleIcon.attr("src", iconURL)}`);

        // Add current temperature
        currentTemp.html("Temperature: " + response.main.temp + metric);

        // Add current humidity
        currentHumidity.html("Humidity: " + response.main.humidity + "%");

        // Add current wind speed
        currentWind.html("Wind Speed: " + response.wind.speed + windMetric);
        };

    });

    // Trigger five day forecast function

    fiveDay()

    // Reset City Data so that a new search can be made. If this isn't done, the above if statement doesn't apply and allows the API to be called before the GEO API has finsihed
    cityData = [
        {city: ''},
        {lon: 0},
        {lat: 0}
    ];
};

// Present user with future weather conditions

function fiveDay() {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?&units=" + units + "&lat=" + cityData[2].lat + "&lon=" + cityData[1].lon + "&appid=" + apiKey;

    $.ajax ({
    url: queryURL,
    method: "GET"
        
    }).then(function(response) {

        // Globe is returned when the GEO API hasn't finished so IF statement ensures data displayed will never be Globe
        if (response.name == "Globe") {
            cityTitle.text("Fetching weather data...");

            // Timeout is to prevent excessive calls to the API. There is already 150ms further up so this is an added measure
            setTimeout(() => {
                getForecast();
            }, 150);

        } else {


            var futureFiveDates =[];
            var fiveDaysForecast = [];

            // Create an array with the date of the next 5 days to compare with incoming weather data and only fetch the data for said date
            for (var i = 1; i < 6; i++) {
            futureFiveDates.push(moment().day(i).format("YYYY-MM-DD 12:00:00"));

            };

            // Loop to check dates array is contained in the API response and save only relevant weather data into new array
            for (let i = 0; i < response.list.length; i++) {
                for(let j = 0; j < futureFiveDates.length; j++) {
                    // Check if array [i] date contains the date in futureFive Dates
                    if(response.list[i].dt_txt == futureFiveDates[j]) {
                        // Push only the matching array into Five Days Forecast which will be used as the data to append
                        fiveDaysForecast.push(response.list[i]);
                    };
                }; 
            };

            // Loop to dynamically create HTML
            for (var i = 0; i < fiveDaysForecast.length; i++) {

                // Create card container DIV
                let forecastCard = $('<div>')
                .addClass("card text-white bg-primary mb-3")
                .attr("style", "max-width: 20%;");

                // Create Card header
                let cardHeader = $('<div>')
                .addClass("card-header")
                .text(moment.unix(fiveDaysForecast[i].dt).format("DD/MM/YYYY"));

                // Create Card Body
                let cardBody = $('<div>')
                .addClass("card-body");

                // Create card Temp
                let cardTemp = $('<p>')
                .attr("id", "card-temp")
                .html("Temp: " + fiveDaysForecast[i].main.temp + metric);

                // Create card Wind
                let cardWind = $('<p>')
                .attr("id", "card-wind")
                .html("Wind: " + fiveDaysForecast[i].wind.speed + windMetric);

                // Create card Humidity
                let cardHumidity = $('<p>')
                .attr("id", "card-wind")
                .html("Humidity: " + fiveDaysForecast[i].main.humidity + " %");

                cardBody.append(cardTemp);
                cardBody.append(cardWind);
                cardBody.append(cardHumidity);
                forecastCard.append(cardHeader);
                cardContainer.append(forecastCard);
                cardContainer.append(cardBody);

            };
        };

    });

};

    // Search query is stored in localstorage as uppercase
        // Check if search term already exists in storage and add if not
    // Button created in search history linked to Local storage search
        // Loop to check storage and create button if there is a search history
            // search term saved as data-city submits to API again
    // Clear Search History button to delete all local storage and therefore all history buttons

// Display user search term as a button
    // When clicked, search is completed again
        // Data-city attribute is stored and can be used as the search term

// Search History Local Storage when a new search is completed (not restored in local storage)
    // Key = History
    // Oject