import './style.css';
import { fromUnixTime, intlFormat } from 'date-fns';

const apiKey = '9095cc5220ce63f359ff2704300c35ba';

interface CityDetails {
  cityName: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface CurrentWeatherDetails {
  date: string;
  time: string;
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

interface ForecastDetails {
  dateTime: number;
  temp: number;
  weather: string;
  icon: string;
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
  const date = weatherDetails.date;
  const time = weatherDetails.time;
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
    date,
    time,
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

const CreateForecastDetailsObj = (forecastDetails: ForecastDetails): ForecastDetails => {
  const dateTime = forecastDetails.dateTime;
  const temp = forecastDetails.temp;
  const weather = forecastDetails.weather;
  const icon = forecastDetails.icon;

  return {
    dateTime,
    temp,
    weather,
    icon
  };
};

const getCityDetails = async (cityName: string): Promise<CityDetails> => {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`, { mode: 'cors' });
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
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityDetails.lat}&lon=${cityDetails.lon}&units=metric&appid=${apiKey}`, { mode: 'cors' });
    const currentWeatherInfo = await response.json();

    const dateAndTime = getDateAndTime(currentWeatherInfo.dt);

    const currentWeatherDetails = CreateCurrentWeatherDetailsObj({
      date: getDateAndTime(currentWeatherInfo.dt).date,
      time: getDateAndTime(currentWeatherInfo.dt).time,
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

    console.log(currentWeatherInfo)
    console.log(currentWeatherDetails); //! REMOVE LATER!
    return currentWeatherDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getThreeDaysForecast = async (cityName: string): Promise<ForecastDetails[]> => {
  const cityDetails = await getCityDetails(cityName);

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityDetails.lat}&lon=${cityDetails.lon}&units=metric&cnt=24&appid=${apiKey}`, {mode: 'cors'});
    const forecastInfo = await response.json();

    const dateTimeArray: number[] = [];
    const tempArray: number[] = [];
    const weatherArray: string[] = [];
    const iconArray: string[] = [];

    forecastInfo.list.forEach((forecast: any) => {
      dateTimeArray.push(forecast.dt);
      tempArray.push(forecast.main.temp);
      weatherArray.push(forecast.weather[0].description);
      iconArray.push(forecast.weather[0].icon);
    });

    const totalForecastList: ForecastDetails[] = [];

    for (let index = 0; index < 24; index += 1) {
      const forecastObject = CreateForecastDetailsObj({
        dateTime: dateTimeArray[index],
        temp: tempArray[index],
        weather: weatherArray[index],
        icon: iconArray[index]
      });

      totalForecastList.push(forecastObject);
    }

    console.log(totalForecastList); //! REMOVE LATER
    return totalForecastList;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDateAndTime = (unixTime: number) => {
  const date = intlFormat(fromUnixTime(unixTime), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const time = intlFormat(fromUnixTime(unixTime), {
    hour: 'numeric',
    minute: 'numeric'
  });

  return { date, time };
};

const formatTemp = (temp: number): string => {
  if (api().unit === 'metric') {
    return `${temp}°C`;
  } else if (api().unit === 'imperial') {
    return `${temp}°F`;
  }
};

const formatWindSpeed = (windSpeed: number): string => {
  if (api().unit === 'metric') {
    return `${windSpeed}m/s`;
  } else if (api().unit === 'imperial') {
    return `${windSpeed}mph`;
  }
};

const capitalizeWeatherDescription = (weatherDescription: string): string =>  weatherDescription.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');

getCurrentWeather('owerri');
getThreeDaysForecast('owerri');