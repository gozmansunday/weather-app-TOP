import './style.css';

interface CityDetails {
  cityName: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface CurrentWeatherDetails {
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
  weatherIcon: string;
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

const CreateCurrentWeatherDetailsObj = (weatherDetails: CurrentWeatherDetails): CurrentWeatherDetails => {
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
  const weatherIcon = weatherDetails.weatherIcon;

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
    weatherDescription,
    weatherIcon
  };
};

const getCityDetails = async (cityName: string): Promise<CityDetails> => {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=9095cc5220ce63f359ff2704300c35ba`, { mode: 'cors' });
    const citiesList = await response.json();
    const countryFullname = new Intl.DisplayNames(['en'], { type: 'region' });

    const cityDetails = CreateCityDetailsObj({
      cityName: citiesList[0].name,
      state: citiesList[0].state,
      country: countryFullname.of(citiesList[0].country),
      lat: citiesList[0].lat,
      lon: citiesList[0].lon
    });

    return cityDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCurrentWeather = async (cityName: string): Promise<CurrentWeatherDetails> => {
  const cityDetails = await getCityDetails(cityName);
  console.log(cityDetails); //!REMOVE LATER!

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityDetails.lat}&lon=${cityDetails.lon}&units=metric&appid=9095cc5220ce63f359ff2704300c35ba`, { mode: 'cors' });
    const currentWeatherInfo = await response.json();

    const currentWeatherDetails = CreateCurrentWeatherDetailsObj({
      dataCalcTime: currentWeatherInfo.dt,
      currentTemp: currentWeatherInfo.main.temp,
      feelsLikeTemp: currentWeatherInfo.main.feels_like,
      maxTemp: currentWeatherInfo.main.temp_max,
      minTemp: currentWeatherInfo.main.temp_min,
      humidity: currentWeatherInfo.main.humidity,
      pressure: currentWeatherInfo.main.pressure,
      sunrise: currentWeatherInfo.sys.sunrise,
      sunset: currentWeatherInfo.sys.sunset,
      visibility: currentWeatherInfo.visibility,
      windSpeed: currentWeatherInfo.wind.speed,
      mainWeather: currentWeatherInfo.weather[0].main,
      weatherDescription: currentWeatherInfo.weather[0].description,
      weatherIcon: currentWeatherInfo.weather[0].icon
    });

    console.log(currentWeatherDetails); //! REMOVE LATER!
    return currentWeatherDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};

getCurrentWeather('new delhi');