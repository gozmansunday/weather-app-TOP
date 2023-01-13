import './style.css';

interface CityDetails {
  cityName: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface WeatherDetails {
  dataCalcTime: number;
  currentTemp: number;
  feelsLikeTemp: number;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  pressure: number;
  sunrise: number;
  sunset: number;
  visibility: number;
  windSpeed: number;
  mainWeather: string;
  weatherDescription: string;
}

const CreateCityDetailsObj = (cityDetails: CityDetails): CityDetails => {
  const cityName = cityDetails.cityName;
  const state = cityDetails.state;
  const country = cityDetails.country;
  const lat = cityDetails.lat;
  const lon = cityDetails.lon;

  return {
    cityName,
    state,
    country,
    lat,
    lon
  }
};

const CreateCurrentWeatherDetailsObj = (weatherDetails: WeatherDetails): WeatherDetails => {
  const dataCalcTime = weatherDetails.dataCalcTime;
  const currentTemp = weatherDetails.currentTemp;
  const feelsLikeTemp = weatherDetails.feelsLikeTemp;
  const maxTemp = weatherDetails.maxTemp;
  const minTemp = weatherDetails.minTemp;
  const humidity = weatherDetails.humidity;
  const pressure = weatherDetails.pressure;
  const sunrise = weatherDetails.sunrise;
  const sunset = weatherDetails.sunset;
  const visibility = weatherDetails.visibility;
  const windSpeed = weatherDetails.windSpeed;
  const mainWeather = weatherDetails.mainWeather;
  const weatherDescription = weatherDetails.weatherDescription;

  return {
    dataCalcTime,
    currentTemp,
    feelsLikeTemp,
    maxTemp,
    minTemp,
    humidity,
    pressure,
    sunrise,
    sunset,
    visibility,
    windSpeed,
    mainWeather,
    weatherDescription
  };
};

const getCityDetails = async (cityName: string): Promise<CityDetails> => {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=9095cc5220ce63f359ff2704300c35ba`);
    const citiesList = await response.json();
    const cityDetails = CreateCityDetailsObj({ cityName: citiesList[0].name, state: citiesList[0].state, country: citiesList[0].country, lat: citiesList[0].lat, lon: citiesList[0].lon });

    return cityDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCurrentWeather = async (cityName: string) => {
  const cityDetails = await getCityDetails(cityName);

  console.log(cityDetails); //!REMOVE LATER!
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityDetails.lat}&lon=${cityDetails.lon}&units=metric&appid=9095cc5220ce63f359ff2704300c35ba`);
    const currentWeatherInfo = await response.json();
    // TODO: create the object that contains the needed information.

    console.log(currentWeatherInfo); //! REMOVE LATER!
  } catch (error) {
    throw new Error(error.message);
  }
};

getCurrentWeather('Onitsha');