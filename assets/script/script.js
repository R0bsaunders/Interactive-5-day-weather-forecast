// Prompt that allows user to enter city as search term
    // Validate if search box empty or contains illegal characters (numbers & special characters)
    // Use Geography API to convert city into longitude and latitude
    // Send weather query url to api and GET result
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
var searches = [
    {city: ""},
];

var units = "metric";
var coordinates = {
    lon: '5.25',
    lat: '45.66'
};
const apiKey = "bc744fa552e2cd837d8b4a8ae3dc6265";
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?units=" + units + "&lat=" + coordinates.lat + "&lon=" + coordinates.lon + "&appid=" + apiKey;


$.ajax ({

url: queryURL,
method: "GET"

}).then(function(response) {


console.log(response);


});