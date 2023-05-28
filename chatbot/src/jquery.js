// Function for implementing weather API. It is imported in main App.js file
export async function checkWeather(cityName) {
    const apiKey = '16194f5cbf502d2f395ef2d9ba649a39';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
  
    console.log(data);
  }
  