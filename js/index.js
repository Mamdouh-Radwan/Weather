let cityInput = document.getElementById('cityInput');
const cityAlert = document.getElementById('cityAlert');
let userLocation ='';

cityInput.addEventListener('keyup', function(e){

  if(e.target.value === ""){
    cityAlert.classList.add('d-none');
    cityAlert.classList.remove('d-block');
    getWeather(userLocation);
  }
  else{
    getWeather(`q=${e.target.value}`);
  }
});

async function getWeather(city){
  try{
    let contryNameResponse = await fetch(`https://api.weatherapi.com/v1/search.json?key=a71bde5aeb844e9fbb4110647242406&${city}`);
    let countryObject = await contryNameResponse.json();

    if(contryNameResponse.ok && contryNameResponse.status === 200 && countryObject.length > 0){
      cityAlert.classList.add('d-none');
      cityAlert.classList.remove('d-block');

      let countryData = await countryObject[0];
      let cityName = await countryData.name;
      
      let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a71bde5aeb844e9fbb4110647242406&q=${cityName}&days=3`);
      // console.log(response);
      if(response.ok && response.status === 200){
        let data = await response.json();
        console.log(data);
        weatherObject = dataExtract(data);
        console.log(weatherObject);
        displayWeather(weatherObject);
      }
    }
    else{
      cityAlert.classList.add('d-block');
      cityAlert.classList.remove('d-none');
    }
  }
  catch(error){
    console.log(error);
  }
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function dataExtract(dObject){
    let curDate = new Date(dObject.location.localtime.split(" ")[0]);
    
    let foreDate1 = new Date (dObject.forecast.forecastday[1].date)

    let foreDate2 = new Date (dObject.forecast.forecastday[2].date)
    
    weatherData = {
        cityName: dObject.location.name,
        currentDay: {
            dateDay: days[curDate.getDay()],
            dateMonth: months[curDate.getMonth()],
            date: curDate.getDate(),
            temp: dObject.current.temp_c,
            icon: dObject.current.condition.icon,
            condition: dObject.current.condition.text,
            rain: dObject.current.precip_in,
            windSpeed: dObject.current.wind_kph,
            windDir: dObject.current.wind_dir
        },
        forecastday1: {
            dateDay: days[foreDate1.getDay()],
            icon: dObject.forecast.forecastday[1].day.condition.icon,
            maxTemp: dObject.forecast.forecastday[1].day.maxtemp_c,
            minTemp: dObject.forecast.forecastday[1].day.mintemp_c,
            condition: dObject.forecast.forecastday[1].day.condition.text
        },
        forecastday2: {
            dateDay: days[foreDate2.getDay()],
            icon: dObject.forecast.forecastday[2].day.condition.icon,
            maxTemp: dObject.forecast.forecastday[2].day.maxtemp_c,
            minTemp: dObject.forecast.forecastday[2].day.mintemp_c,
            condition: dObject.forecast.forecastday[2].day.condition.text
        }
    }
    return weatherData;
}

function displayWeather(dataObject) {
    let displayScreen = document.getElementById('weatherScreen');

    displayScreen.innerHTML = `
    <div class="row">
          <div class="temp-card col-lg-4 text-white text-center px-0">
            <div class="date d-flex justify-content-between align-items-center px-2">
              <p>${dataObject.currentDay.dateDay}</p>
              <p>${dataObject.currentDay.date}${dataObject.currentDay.dateMonth}</p>
            </div>
            <div class="weather p-3">
              <p class="city-name text-start">${dataObject.cityName}</p>
              <div class="temprature d-flex align-items-center justify-content-between">
                <p class="degree display-1 fw-bolder">${dataObject.currentDay.temp}°C</p>
                <img src="https:${dataObject.currentDay.icon}" alt="">
              </div>
              <p class="condition text-start text-info">${dataObject.currentDay.condition}</p>
              <div class="info d-flex align-items-center justify-content-center">
                <div class="rain me-5">
                  <img class="me-1" src="./images/icon-umberella.png" alt="">
                  <span>${dataObject.currentDay.rain}%</span>
                </div>
                <div class="wind me-5">
                  <img class="me-1" src="./images/icon-wind.png" alt="">
                  <span>${dataObject.currentDay.windSpeed}km/h</span>
                </div>
                <div class="wind-dir me-5">
                  <img class="me-1" src="./images/icon-compass.png" alt="">
                  <span>${dataObject.currentDay.windDir}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="tmrw-temp-card col-lg-4 text-white text-center px-0">
            <div class="tmrw date text-center">
              <p>${dataObject.forecastday1.dateDay}</p>
            </div>
            <div class="weather p-3 text-center">
              <img class="py-3" src="https:${dataObject.forecastday1.icon}" alt="">
              <p class="fs-2 fw-bold m-0">${dataObject.forecastday1.maxTemp}°C</p>
              <p class="text-secondary">${dataObject.forecastday1.minTemp}°C</p>
              <p class="condition text-info mt-5">Sunny</p>
            </div>
          </div>
          <div class="temp-card col-lg-4 text-white text-center px-0">
            <div class="date text-center">
              <p>${dataObject.forecastday2.dateDay}</p>
            </div>
            <div class="weather p-3 text-center">
              <img class="py-3" src="https:${dataObject.forecastday2.icon}" alt="">
              <p class="fs-2 fw-bold m-0">${dataObject.forecastday2.maxTemp}°C</p>
              <p class="text-secondary">${dataObject.forecastday2.minTemp}°C</p>
              <p class="condition text-info mt-5">Sunny</p>
            </div>
          </div>
        </div>
    `
}

function locateUser(){
  return new Promise(() =>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(getPosition);
    }
    else{
      userLocation = "q=auto:ip";
      getWeather(userLocation);
    }
  });
  
}

function getPosition(position){
  return new Promise(async() => {
    lat = await position.coords.latitude
    long = await position.coords.longitude
    userLocation = `q=${lat},${long}`
    console.log(userLocation);
    getWeather(userLocation);
  })
}
locateUser();
