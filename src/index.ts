import './style.css';
import { intlFormat } from 'date-fns';
import toggleBtn from './modules/theme-toggle';
import * as dom from './modules/dom';
import { DateTime } from 'luxon';

// Interfaces for various objects
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
  currentTemp: string;
  feelsLikeTemp: string;
  humidity: string;
  pressure: string;
  sunrise: string;
  sunset: string;
  timezone: number;
  visibility: string;
  windSpeed: string;
  weatherDescription: string;
  weatherIcon: string;
  weatherID: number;
}

interface ForecastDetails {
  date: string;
  time: string;
  temp: string;
  weather: string;
  icon: string;
  weatherID: number;
}

// Various objects Constructors
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
    lon,
  };
};

const CreateCurrentWeatherDetailsObj = (weatherDetails: CurrentWeatherDetails): CurrentWeatherDetails => {
  const date = weatherDetails.date;
  const time = weatherDetails.time;
  const currentTemp = weatherDetails.currentTemp;
  const feelsLikeTemp = weatherDetails.feelsLikeTemp;
  const humidity = weatherDetails.humidity;
  const pressure = weatherDetails.pressure;
  const sunrise = weatherDetails.sunrise;
  const sunset = weatherDetails.sunset;
  const timezone = weatherDetails.timezone;
  const windSpeed = weatherDetails.windSpeed;
  const visibility = weatherDetails.visibility;
  const weatherDescription = weatherDetails.weatherDescription;
  const weatherIcon = weatherDetails.weatherIcon;
  const weatherID = weatherDetails.weatherID;

  return {
    date,
    time,
    currentTemp,
    feelsLikeTemp,
    humidity,
    pressure,
    sunrise,
    sunset,
    timezone,
    visibility,
    windSpeed,
    weatherDescription,
    weatherIcon,
    weatherID,
  };
};

const CreateForecastDetailsObj = (forecastDetails: ForecastDetails): ForecastDetails => {
  const date = forecastDetails.date;
  const time = forecastDetails.time;
  const temp = forecastDetails.temp;
  const weather = forecastDetails.weather;
  const icon = forecastDetails.icon;
  const weatherID = forecastDetails.weatherID;

  return {
    date,
    time,
    temp,
    weather,
    icon,
    weatherID,
  };
};

// Function to call OpenWeather's Geocoding API to get details of a city.
const getCityDetails = async (cityName: string, apiKey: string): Promise<CityDetails> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`, { mode: 'cors' });
    const citiesList = await response.json();
    // get the city's country fullname
    const countryFullname = new Intl.DisplayNames(['en'], { type: 'region' });

    // create an object containing details of the city
    const cityDetails = CreateCityDetailsObj({
      cityName: citiesList[0].name,
      state: citiesList[0].state,
      country: countryFullname.of(citiesList[0].country),
      lat: citiesList[0].lat,
      lon: citiesList[0].lon,
    });

    return cityDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to call OpenWeather's API to get the current weather information
const getCurrentWeather = async (cityName: string, apiKey: string, apiUnit: string
): Promise<CurrentWeatherDetails> => {
  // get city details object from city details function
  const cityDetails = await getCityDetails(cityName, apiKey);

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityDetails.lat}&lon=${cityDetails.lon}&units=${apiUnit}&appid=${apiKey}`, { mode: 'cors' });
    const currentWeatherInfo = await response.json();

    // create an object containig information about the current weather of the city
    const currentWeatherDetails = CreateCurrentWeatherDetailsObj({
      date: getLocalDateTime(currentWeatherInfo.dt, currentWeatherInfo.timezone).localDate,
      time: getLocalDateTime(currentWeatherInfo.dt, currentWeatherInfo.timezone).localTime,
      currentTemp: formatTemp(Math.round(currentWeatherInfo.main.temp), apiUnit),
      feelsLikeTemp: formatTemp(Math.round(currentWeatherInfo.main.feels_like), apiUnit),
      humidity: `${currentWeatherInfo.main.humidity}%`,
      pressure: `${currentWeatherInfo.main.pressure}hPa`,
      sunrise: getLocalDateTime(currentWeatherInfo.sys.sunrise, currentWeatherInfo.timezone).localTime,
      sunset: getLocalDateTime(currentWeatherInfo.sys.sunset, currentWeatherInfo.timezone).localTime,
      timezone: currentWeatherInfo.timezone,
      visibility: `${currentWeatherInfo.visibility / 1000}km`,
      windSpeed: formatWindSpeed(currentWeatherInfo.wind.speed, apiUnit),
      weatherDescription: capitalizeWeatherDescription(currentWeatherInfo.weather[0].description),
      weatherIcon: currentWeatherInfo.weather[0].icon,
      weatherID: currentWeatherInfo.weather[0].id,
    });

    // console.log(currentWeatherInfo); //! REMOVE LATER!
    displayDetails(cityDetails, currentWeatherDetails);
    return currentWeatherDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to get the local date and time of a city
const getLocalDateTime = (timestamp: number, offset: number) => {
  // create a DateTime object from the timestamp (converted from seconds to milliseconds)
  const date = DateTime.fromMillis(timestamp * 1000);

  // get the UTC offset string
  let offsetString: string;
  if (offset % 3600 === 0) {
    // if the offset is a whole hour, use the format "UTC+5" or "UTC-5"
    offsetString = `UTC${Math.sign(offset) === 1 ? '+' : '-'}${Math.abs(offset / 3600)}`;
  } else {
    // if the offset is not a whole hour, use the format "UTC+5:30" or "UTC-5:30"
    offsetString = `UTC${Math.sign(offset) === 1 ? '+' : '-'}${Math.floor(Math.abs(offset / 3600))}:${Math.round((Math.abs(offset / 3600) - Math.floor(Math.abs(offset / 3600))) * 60)}`;
  }

  // Adjust the time zone offset
  let time = date.setZone(offsetString).toString();

  if (time.length > 24) {
    time = time.slice(0, -6);
  } else if (time.length === 24) {
    time = time.slice(0, -1);
  }

  // change date to required format
  const localDate = intlFormat(new Date(time), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // change time to required format
  const localTime = intlFormat(new Date(time), {
    hour: 'numeric',
    minute: 'numeric',
  });

  return { localDate, localTime };
};

// Function to format temperature based on the chosen measuring system
const formatTemp = (temp: number, apiUnit: string): string => {
  if (apiUnit === 'metric') {
    return `${temp}°C`;
  } else if (apiUnit === 'imperial') {
    return `${temp}°F`;
  }
};

// Function to format wind speed based on the chosen measuring system
const formatWindSpeed = (windSpeed: number, apiUnit: string): string => {
  if (apiUnit === 'metric') {
    return `${windSpeed}m/s`;
  } else if (apiUnit === 'imperial') {
    return `${windSpeed}mph`;
  }
};

// Function to capitalize each word of the weather description in current weather
const capitalizeWeatherDescription = (weatherDescription: string): string => weatherDescription.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');

// Function to display weather details
const displayDetails = (cityDetails: CityDetails, currentWeatherDetails: CurrentWeatherDetails): void => {
  // for first info
  let regionName: string;

  if (cityDetails.state === undefined) {
    regionName = `${cityDetails.country}`;
  } else {
    regionName = `${cityDetails.state}, ${cityDetails.country}`;
  }

  // for second info
  const iconsData = require('./assets/json/icons.json');

  const iconSvgPath = getSvgPath(currentWeatherDetails.weatherID, currentWeatherDetails.weatherIcon, iconsData);
  
  dom.displayCityFirstInformation(cityDetails, currentWeatherDetails, regionName);
  dom.displayCitySecondInformation(currentWeatherDetails, iconSvgPath);
  dom.displayCityThirdInformation(currentWeatherDetails);
};

const getSvgPath = (id: number, icon: string | undefined, array: any[]): string => {
  for (const obj of array) {
    if (obj.id === id && obj.icon === icon) {
      return obj.svgPath;
    }
  }
};

const runApp = (): void => {
  // TODO: clean up main function
  toggleBtn();

  const apiKey = '9095cc5220ce63f359ff2704300c35ba';
  let apiUnit: string;
  let cityName: string;

  if (localStorage.getItem('cityName')) {
    cityName = JSON.parse(localStorage.getItem('cityName'));
  } else {
    cityName = 'greenwich';
  }

  if (localStorage.getItem('unit')) {
    apiUnit = JSON.parse(localStorage.getItem('unit'));
    if (apiUnit === 'imperial') {
      dom.selector.unitToggleBtn.checked = true;
    }
  } else {
    apiUnit = 'metric';
  }

  dom.selector.unitToggleBtn.onclick = () => {
    if (apiUnit === 'metric') {
      apiUnit = 'imperial';
    } else if (apiUnit === 'imperial') {
      apiUnit = 'metric';
    }

    getCurrentWeather(cityName, apiKey, apiUnit);
    localStorage.setItem('unit', JSON.stringify(apiUnit));
  };

  getCurrentWeather(cityName, apiKey, apiUnit);

  dom.selector.searchSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const cityName = dom.selector.citySearch.value;
    localStorage.setItem('cityName', JSON.stringify(cityName));

    getCurrentWeather(cityName, apiKey, apiUnit);

    dom.selector.unitToggleBtn.onclick = () => {
      if (apiUnit === 'metric') {
        apiUnit = 'imperial';
      } else if (apiUnit === 'imperial') {
        apiUnit = 'metric';
      }

      getCurrentWeather(cityName, apiKey, apiUnit);
      localStorage.setItem('unit', JSON.stringify(apiUnit));
    };
  });
};

runApp();

export {
  CityDetails,
  CurrentWeatherDetails,
};