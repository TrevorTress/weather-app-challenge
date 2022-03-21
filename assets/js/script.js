var cityNameEl = document.getElementById('city-name-main')
var cityTempEl = document.getElementById('city-temp-main')
var cityWindEl = document.getElementById('city-wind-main')
var cityHumidEl = document.getElementById('city-humid-main')
var cityUviEl = document.getElementById('city-uv-main')
var savedCityBox = document.getElementById("search-box")


const m = moment()

// allows search box to auto fill locations w/ google
let autocomplete
var initAutocomplete = function() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),
        {
            types: ['(regions)'],
            componentRestrictions: {'country': ['us']},
            fields: ['geometry', 'name']
        }
    )
    
    // when location is selected, initiate function
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        var chosenCity = place.name

        
        var savedCityEl = document.createElement('p')
        savedCityEl.innerText = chosenCity
        savedCityEl.classList = 'text-center border border-black rounded my-2 p-2'
        savedCityBox.appendChild(savedCityEl)


        // location name is used to specify geocode request
        var geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + chosenCity + '&key=AIzaSyD-e97oHhkLd5d_RGMQVsXsQ9pNU4Rk5HI'
        
        // get lat/long values and assign to variables
        fetch(geoUrl).then(function(response) {
            response.json().then(function(data) {
        
                var cityLat = data.results[0].geometry.location.lat
                var cityLng = data.results[0].geometry.location.lng
        
                // lat and long values are input into weather API to get specific weather
                var weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLng + '&appid=a7ed68c0e4c6215fefcdb05ba6195eac'
        
                // get weather values from API
                fetch(weatherUrl).then(function(response) {
                    response.json().then(function(data) {
        
                        // temps need to be converted from Kelvin
                        var currentTempF = (data.current.temp - 273.15) * 9/5 + 32
                        var currentTempFinal = parseFloat(currentTempF.toFixed(1))
        
                        // current values are updated by data
                        cityNameEl.innerText = chosenCity + ', ' + m.format('l')
                        cityTempEl.innerText = 'Temperature: ' + currentTempFinal + ' degrees'
                        cityWindEl.innerText = 'Wind Speed: ' + data.current.wind_speed + ' mph'
                        cityHumidEl.innerText = 'Humidity: ' + data.current.humidity + '%'
                        cityUviEl.innerText = 'UV Index: ' + data.current.uvi
        
                        // loop to create 5 boxes with weather info pulled from data
                        for(i=0; i <= 4; i ++) {
                            
                            // make day block
                            var forecastBlockEl = document.createElement('div')
                            forecastBlockEl.classList = "bg-green-300 p-3 col-span-1 text-m leading-10"
        
                            // use moment.js to set date of box
                            var forecastDateEl = document.createElement('h3')
                            forecastDateEl.innerText = m.add(1, 'd').format('l')
                            forecastDateEl.classList = "text-lg font-bold"
        
                            // use favicon to create weather symbol (NOT FUNCTIONAL)
                            var forecastIconEl = document.createElement('p')
                            forecastIconEl.innerText = '000'
                            
                            // temps need to be converted from Kelvin)
                            var maxTempK = data.daily[i].temp.max
                            var minTempK = data.daily[i].temp.min
                            var maxTempF = (maxTempK - 273.15) * 9/5 + 32
                            var minTempF = (minTempK - 273.15) * 9/5 + 32
                            var maxTempFinal = parseFloat(maxTempF.toFixed(1))
                            var minTempFinal = parseFloat(minTempF.toFixed(1))
        
                            // API data creates high/low temp, wind speed, humidity, and UVI elements
                            var forecastTempMaxEl = document.createElement('p')
                            forecastTempMaxEl.innerText = 'High: ' + maxTempFinal + ' degrees'
        
                            var forecastTempMinEl = document.createElement('p')
                            forecastTempMinEl.innerText = 'Low: ' + minTempFinal + ' degrees'
        
                            var forecastWindEl = document.createElement('p')
                            forecastWindEl.innerText = 'Wind Speed: ' + data.daily[i].wind_speed + ' mph'
        
                            var forecastHumidEl = document.createElement('p')
                            forecastHumidEl.innerText = 'Humidity: ' + data.daily[i].humidity + '%'
        
                            // append all of our data to the block
                            forecastBlockEl.append(forecastDateEl, forecastIconEl, forecastTempMaxEl, forecastTempMinEl, forecastWindEl, forecastHumidEl)
        
                            //add our block to the grid
                            document.getElementById('main-grid').appendChild(forecastBlockEl)
                        }
                    })
                })
            })
        })
    })   
}

