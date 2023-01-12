import './style.css';

interface CityDetails {
  cityName: string;
  state: string;
  country: string;
  lon: number;
  lat: number;
}

const CreateCityDetailsObj = (cityName: string, country: string, lon: number, lat: number, state?: string): CityDetails => {
  return {
    cityName,
    state,
    country,
    lon,
    lat
  };
};

const getCityDetails = async (cityName: string): Promise<CityDetails> => {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=9095cc5220ce63f359ff2704300c35ba`);
    const citiesList = await response.json();
    const topCity = citiesList[0];
    const cityDetails = CreateCityDetailsObj(topCity.name, topCity.country, topCity.lon, topCity.lat, topCity.state);

    return cityDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};

getCityDetails('Onitsha');