import './style.css';
import { fromUnixTime, intlFormat } from 'date-fns';
import toggleBtn from './modules/theme-toggle';

toggleBtn();

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
  maxTemp: string;
  minTemp: string;
  humidity: string;
  pressure: string;
  sunrise: string;
  sunset: string;
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
  const windSpeed = weatherDetails.windSpeed;
  const weatherDescription = weatherDetails.weatherDescription;
  const weatherIcon = weatherDetails.weatherIcon;
  const weatherID = weatherDetails.weatherID;

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
    windSpeed,
    weatherDescription,
    weatherIcon,
    weatherID
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
    weatherID
  };
};

const api = () => {
  const key = '9095cc5220ce63f359ff2704300c35ba';
  const unit = 'metric';

  return { key, unit };
};

const getCityDetails = async (cityName: string): Promise<CityDetails> => {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api().key}`, { mode: 'cors' });
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
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityDetails.lat}&lon=${cityDetails.lon}&units=${api().unit}&appid=${api().key}`, { mode: 'cors' });
    const currentWeatherInfo = await response.json();

    const currentWeatherDetails = CreateCurrentWeatherDetailsObj({
      date: getDateAndTime(currentWeatherInfo.dt).date,
      time: getDateAndTime(currentWeatherInfo.dt).time,
      currentTemp: formatTemp(currentWeatherInfo.main.temp),
      feelsLikeTemp: formatTemp(currentWeatherInfo.main.feels_like),
      maxTemp: formatTemp(currentWeatherInfo.main.temp_max),
      minTemp: formatTemp(currentWeatherInfo.main.temp_min),
      humidity: `${currentWeatherInfo.main.humidity}%`,
      pressure: `${currentWeatherInfo.main.pressure}hPa`,
      sunrise: getDateAndTime(currentWeatherInfo.sys.sunrise).time,
      sunset: getDateAndTime(currentWeatherInfo.sys.sunset).time,
      windSpeed: formatWindSpeed(currentWeatherInfo.wind.speed),
      weatherDescription: capitalizeWeatherDescription(currentWeatherInfo.weather[0].description),
      weatherIcon: currentWeatherInfo.weather[0].icon,
      weatherID: currentWeatherInfo.weather[0].id,
    });

    // console.log(currentWeatherInfo)
    console.log(currentWeatherDetails); //! REMOVE LATER!
    return currentWeatherDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getThreeDaysForecast = async (cityName: string): Promise<ForecastDetails[]> => {
  const cityDetails = await getCityDetails(cityName);

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityDetails.lat}&lon=${cityDetails.lon}&units=${api().unit}&cnt=24&appid=${api().key}`, {mode: 'cors'});
    const forecastInfo = await response.json();

    const dateArray: string[] = [];
    const timeArray: string[] = [];
    const tempArray: string[] = [];
    const weatherArray: string[] = [];
    const iconArray: string[] = [];
    const weatherIDArray: number[] = [];

    forecastInfo.list.forEach((forecast: any) => {
      dateArray.push(getDateAndTime(forecast.dt).date);
      timeArray.push(getDateAndTime(forecast.dt).time);
      tempArray.push(formatTemp(forecast.main.temp));
      weatherArray.push(capitalizeWeatherDescription(forecast.weather[0].description));
      iconArray.push(forecast.weather[0].icon);
      weatherIDArray.push(forecast.weather[0].id);
    });

    const totalForecastList: ForecastDetails[] = [];

    for (let index = 0; index < 24; index += 1) {
      const forecastObject = CreateForecastDetailsObj({
        date: dateArray[index],
        time: timeArray[index],
        temp: tempArray[index],
        weather: weatherArray[index],
        icon: iconArray[index],
        weatherID: weatherIDArray[index]
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

getCurrentWeather('port harcourt');
getThreeDaysForecast('port harcourt');