const tempToday = $('#temp');
const humidityToday = $('#humidity');
const windToday =  $('#wind');
const forecastTitle = $('#forecastToday');
const apiKey = "339169be96f8b23aa553a475404500fd";
const metric =  "&#8451";
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
    getForecast();
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
            getForecast();

        } else {

        forecastTitle.html(response.name);
        tempToday.html("Temperature: " + response.main.temp + metric);
        humidityToday.html("Humidity: " + response.main.humidity + "%");
        windToday.html("Wind Speed: " + response.wind.speed + " mph");
        };
    });
    
    // Reset City Data so that a new search can be made. If this isn't done, the above if statement doesn't apply and allows the API to be called before the GEO API has finsihed
    cityData = [
        {city: ''},
        {lon: 0},
        {lat: 0}
    ];
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


// Present user with current weather conditions
    // The city name
    // The date
    // An icon representation of weather conditions
    // The temperature
    // The humidity
    // The wind speed

// Present user with future weather conditions

    // The date
    // An icon representation of weather conditions
    // The temperature
    // The humidity

// Search History Local Storage when a new search is completed (not restored in local storage)
    // Key = History
    // Oject