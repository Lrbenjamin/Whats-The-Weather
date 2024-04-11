$(document).ready(function () {
    const apiKey = 'ca3280587efca0aefe9fad22deab37ed'; //API key for accessing OpenWeatherMap API
    let searchHistory = []; //array to store search history

function renderSearchHistory() { //function to render search history buttons
    $(".searchHistory").empty();
    for (let i = 0; i < searchHistory.length; i++) {
        const cityBtn = $("<button>"); //create a button for each city in search history
        cityBtn.addClass("btn btn-outline-primary cityBtn"); //add classes to style the button (Bootstrap classes)
        cityBtn.attr("data-city", searchHistory[i]); //set data attribute to store the city name
        cityBtn.text(searchHistory[i]); //set button text to the city name
        $(".searchHistory").prepend(cityBtn); //prepend the button to the search history list
    }
}

function getWeather(city) { //function to fetch weather data for a given city
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    $.ajax({
        url: currentWeatherUrl,
        method: "GET",
    }).then(function (response) { //display current weather information
        const cityDate = moment().format("MMMM Do, YYYY"); //shows Date
        const weatherIcon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`); //finds Icon
        const cityName = $("<h2>").text(response.name); //shows city name
        const temperature = $("<p>").text(`Temperature: ${response.main.temp} °F`);//finds temp
        const humidity = $("<p>").text(`Humidity: ${response.main.humidity} %`);//finds humidity
        const windSpeed = $("<p>").text(`Wind Speed: ${response.wind.speed} MPH`);//finds wind speed

        $(".todayWeather").empty().append(cityName, cityDate, weatherIcon, temperature, humidity, windSpeed);//replaces the old city weather with new citys weather 

        const fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`; //finds the five day forcast from api
        $.ajax({
            url: fiveDayForecastUrl,
            method: "GET",
        }).then(function (response) { //display five-day forecast
            $(".fiveDayForecast").empty();
            for (let i = 0; i < response.list.length; i += 8) { //loop
                const date = moment(response.list[i].dt_txt).format("MM/DD/YYYY"); //shows the date of the weather card
                const icon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png`); //finds the weather icons
                const temp = $("<p>").text(`Temp: ${response.list[i].main.temp} °F`); //temp in fahrenheit
                const humidity = $("<p>").text(`Humidity: ${response.list[i].main.humidity} %`); //finds humidity
                const card = $("<div>").addClass("card col-md-2 bg-primary text-white mr-2"); //creates card using jquery while adding some class 
                card.append($("<div>").addClass("card-body").append(date, icon, temp, humidity)); //new div element using bootstrap
                $(".fiveDayForecast").append(card); //appends card element to the fivedayforcast
            }
        });
    }).fail(function (xhr, status, error) { //handle the case where the city is not found (HTTP status code 404)
        if (xhr.status === 404) {
            alert("City not found. Please enter a valid city name.");
        }
    });
}

$(".searchBtn").on("click", function () { //event listener for the search button
    const city = $("#cityInput").val().trim(); //get the city name from the input field
    if (city !== "") { 
        searchHistory.push(city); //add the city to search history 
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); //save search history to local storage
        renderSearchHistory(); //render updated search history
        getWeather(city); //fetch weather data for the city
        $("#cityInput").val(""); //clear the input field after searching
    }
});

$(document).on("click", ".cityBtn", function () { //event listener for city history buttons
    const city = $(this).attr("data-city"); //fetch weather data for the selected city
    getWeather(city);
});

    
const storedSearchHistory = JSON.parse(localStorage.getItem("searchHistory")); //initialize the page with stored search history
    if (storedSearchHistory !== null) {
    searchHistory = storedSearchHistory;
    renderSearchHistory();
    getWeather(searchHistory[searchHistory.length - 1]);  //display weather for the last searched city
}
});






