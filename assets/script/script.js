const currentTemp = $('#currentTemp');
const currentHumidity = $('#currentHumidity');
const cardContainer = $('#cardContainer')
const currentWind =  $('#currentWind');
const cityTitle = $('#cityTitle');
const titleIcon = $('#titleIcon');
const apiKey = "339169be96f8b23aa553a475404500fd";
const metric =  " &#8451";
const windMetric =  " MPH";
const imperial = " &#8457";
var city = "";
var units = "metric";
var cityData = [
    {city: ''},
    {lon: 0},
    {lat: 0}
];
var searchTerm = "";
var parsed = '';

// Run function that checks for and prints any previous searches
createHistoryButtons();

$('#clearHistory').on("click", function(event){
    localStorage.clear();
});

// Prompt that allows user to enter city as search term
$('#searchButton').on("click", function(event){
    event.preventDefault();

    searchTerm = $('#searchBox').val();
    city = searchTerm.trim();

    if(city == "") {
        // Validate if search box empty or contains illegal characters (numbers & special characters)
        alert("You must enter a search term")
        return;
    };

    // Prompt to show that data is fetching (Helps the user if the API responses are slow)
    cityTitle.text("Fetching weather data...");

    searchHistory();
    triggerSearch();
});

// Listener for search history buttons
$('#searchHistory').on("click", function(event){
    // Get the event target
    var element = event.target;

    // Update city variable to the clicked button's data-city - this will become the search parameter
    city = element.getAttribute("data-city");

    // Prompt to show that data is fetching (Helps the user if the API responses are slow)
    cityTitle.text("Fetching weather data...");

    triggerSearch();
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

        // Add City Name, Date and icon to Title Text
        cityTitle.html(`${response.name} ${moment.unix(response.dt).format("(DD/MM/YYYY)")} <img src=${iconURL} />`);
    
        // Add weather icon to title
        titleIcon.attr("src", iconURL);

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

// Function to present user with future weather conditions
function fiveDay() {

    // This empties the container to prevent stacking of dynamically created cards on future searches
    $('#cardContainer').html("");
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
            
            // Declare new variables to obtain and store next 5 dates excluding today and a new array to hold only applicable weather data from the API
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
console.log(fiveDaysForecast);
            // Loop to dynamically create HTML
            for (var i = 0; i < fiveDaysForecast.length; i++) {

                // Create card container DIV
                let forecastCard = $('<div>')
                .addClass("card text-white bg-primary mb-3 forecast-card")

                // Create Card header
                let cardHeader = $('<div>')
                .addClass("card-header")
                .text(moment.unix(fiveDaysForecast[i].dt).format("DD/MM/YYYY"));

                // Add icon
                let cardIcon = $('<img>')
                .attr("src", `http://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}@2x.png`)
                .addClass("card-icon");

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

                // Append HTML elements
                cardBody.append(cardTemp);
                cardBody.append(cardWind);
                cardBody.append(cardHumidity);
                forecastCard.append(cardHeader);
                forecastCard.append(cardIcon);
                forecastCard.append(cardBody);
                cardContainer.append(forecastCard);

            };
        };
    });
};

// Function to store search term in the local Storage as an array
function searchHistory() {
    // Declare variable as an empty array. This will hold the search term and store it as an array item
    var history = [];

    // Adding search term as an array to History
    history[0] = searchTerm.toUpperCase().trim();

    // Check to see if there is any history yet
    if(!localStorage.history){
        // If there is no key called history in local storage then add it as well as the search term
        localStorage.setItem("history", JSON.stringify(history));
        var button = $('<button>')
        .addClass("btn btn-success btn-sm search-history")
        .text(titlecase(history[0]))
        .attr("data-city", history[0])
        $('#searchHistory').prepend(button)
    };

    // Check to see if the search term already exists so get local storage history key and convert the string into an array
    parsed = JSON.parse(localStorage.history)

    // Run a loop that checks for search term so that the entire argument can be broken if the search exists already
    for (let j = 0; j < parsed.length; j++) {

        if (parsed.includes(history[0])) {
            break;

        } else {
            // If it does not exist then add the term to array and send it back to local storage as a string
            parsed.push(history[0]); 
            localStorage.setItem("history", JSON.stringify(parsed));

            // Dynamically create the HTML buttons on page
            var newHistoryButton = $('<button>')
            .addClass("btn btn-success btn-sm search-history")
            .text(titlecase(history[0]))
            .attr("data-city", history[0])
            $('#searchHistory').prepend(newHistoryButton)
        };
    };
};

// Function to display any results already in history
function createHistoryButtons() {

    if(localStorage.history) {
            
        parsed = JSON.parse(localStorage.history)

        for (let b = 0; b < parsed.length; b++) {
            var historyButton = $('<button>')
            .addClass("btn btn-success btn-sm search-history")          
            .text(titlecase(parsed[b]))
            .attr("data-city", parsed[b])
            $('#searchHistory').prepend(historyButton)
        };
    };
};

// Function to trigger a search
function triggerSearch() {
    getGeo();

    // Timeout gives the GRO API time to return a result and reduce the API demand on the Weather API
    setTimeout(() => {
        getForecast();
        
    }, 150);
};

// Function to have buttons display city name as TitleCase
function titlecase(str) {
    str = str.toLowerCase().split(' ');

    for (let l = 0; l < str.length; l++) {
        str[l] = str[l].charAt(0).toUpperCase() + str[l].slice(1);
    }

    return str.join(' ');
}