import * as interfaces from '../index';

const selector = {
  html: document.querySelector('html') as HTMLHtmlElement,
  searchForm: document.querySelector('#search-form') as HTMLFormElement,
  citySearch: document.querySelector('#city-search') as HTMLInputElement,
  searchSubmitBtn: document.querySelector('#search-submit-btn') as HTMLButtonElement,
  themeToggleBtn: document.querySelector('#theme-toggle-btn') as HTMLButtonElement,
  unitToggleBtn: document.querySelector('#toggle') as HTMLInputElement,
  firstInfoContainer: document.querySelector('#first-info-container') as HTMLDivElement,
  secondInfoContainer: document.querySelector('#second-info-container') as HTMLDivElement,
  thirdInfoContainer: document.querySelector('#third-info-container') as HTMLDivElement,
};

const preventTransitionOnWindowLoad = (): void => {
  window.onload = () => {
    document.body.classList.remove('transition');
  };
};

const loadStoredTheme = (theme: string): void => {
  if (theme === 'light') {
    selector.themeToggleBtn.classList.remove('theme-toggle--toggled');
    selector.html.classList.remove('dark');
  } else if (theme === 'dark') {
    selector.themeToggleBtn.classList.add('theme-toggle--toggled');
    selector.html.classList.add('dark');
  }
};

const toggleTheme = (theme: string): void => {
  selector.themeToggleBtn.classList.toggle('theme-toggle--toggled');

  if (selector.themeToggleBtn.classList.contains('theme-toggle--toggled')) {
    selector.html.classList.add('dark');
    theme = 'dark';
  } else {
    selector.html.classList.remove('dark');
    theme = 'light';
  }
  
  localStorage.setItem('theme', JSON.stringify(theme));
};

const displayCityFirstInformation = (cityDetails: interfaces.CityDetails, currentWeatherDetails: interfaces.CurrentWeatherDetails, regionName: string): void => {
  const firstInfo = `
    <div>
      <h1 class="text-[1.6rem] leading-[1] font-semibold -ml-0.5 xs:text-[2rem] sm:text-[2.25rem] md:text-[3.2rem] md:-ml-1 lg:text-[3.75rem]">
        ${cityDetails.cityName}
      </h1>
      <p class="font-bebas text-sm tracking-wide text-neutral-600 xs:text-base sm:text-lg md:text-2xl lg:text-3xl dark:text-neutral-500">
        ${regionName}
      </p>
    </div>

    <div class="text-base sm:text-lg md:text-2xl">
      <p>
        ${currentWeatherDetails.date}
      </p>
      <p>
        ${currentWeatherDetails.time}
      </p>
      <p class="mt-4 font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:mt-6">
        ${currentWeatherDetails.currentTemp}
      </p>
    </div>
    `;

  selector.firstInfoContainer.innerHTML = firstInfo;
};

const displayCitySecondInformation = (currentWeatherDetails: interfaces.CurrentWeatherDetails, iconSvgPath: string): void => {
  const secondInfo = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
      class="w-20 h-20 xs:w-24 xs:h-24 sm:w-[6.5rem] sm:h-[6.5rem] md:w-36 md:h-36 lg:w-40 lg:h-40 md:mx-auto"
      viewBox="0 0 16 16">
      <path
        d="${iconSvgPath}" />
    </svg>

    <!-- Current Weather Details -->
    <div class="my-auto self-center md:my-0">
      <p class="text-lg font-semibold sm:text-xl md:text-2xl">
        ${currentWeatherDetails.weatherDescription}
      </p>
      <p class="text-base sm:text-lg md:text-xl">
        Feels like ${currentWeatherDetails.feelsLikeTemp}
      </p>
    </div>
    `;
  
  selector.secondInfoContainer.innerHTML = secondInfo;
};

const displayCityThirdInformation = (currentWeatherDetails: interfaces.CurrentWeatherDetails): void => {
  const thirdInfo = `
    <div class="border-neutral-700 divide-neutral-700 border-y-[3px] divide-y-2 mt-10 sm:mt-12 lg:mt-0 md:border-y-4 md:divide-y-[3px] dark:border-neutral-400 dark:divide-neutral-400">

      <!-- Humidity -->
      <div class="flex justify-between items-center font-semibold pt-1 pb-0.5 xs:py-2">
        <div class="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-6 h-6 pb-0.5 sm:w-8 sm:h-8 sm:pb-0.5"
            viewBox="0 0 16 16">
            <path
              d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5h-2zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a28.458 28.458 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a28.458 28.458 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001L7 1.5zm0 0-.364-.343L7 1.5zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267z" />
          </svg>
          <p class="text-base xs:text-lg sm:text-xl">
            Humidity
          </p>
        </div>

        <div class="text-lg xs:text-xl sm:text-2xl">
          ${currentWeatherDetails.humidity}
        </div>
      </div>

      <!-- Sunrise -->
      <div class="flex justify-between items-center font-semibold pt-1 pb-0.5 xs:py-2">
        <div class="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-6 h-6 pb-0.5 sm:w-8 sm:h-8 sm:pb-0.5"
            viewBox="0 0 16 16">
            <path
              d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
          </svg>
          <p class="text-base xs:text-lg sm:text-xl">
            Sunrise
          </p>
        </div>

        <div class="text-lg xs:text-xl sm:text-2xl">
          ${currentWeatherDetails.sunrise}
        </div>
      </div>

      <!-- Sunset -->
      <div class="flex justify-between items-center font-semibold pt-1 pb-0.5 xs:py-2">
        <div class="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-6 h-6 pb-0.5 sm:w-8 sm:h-8 sm:pb-0.5"
            viewBox="0 0 16 16">
            <path
              d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
          </svg>
          <p class="text-base xs:text-lg sm:text-xl">
            Sunset
          </p>
        </div>

        <div class="text-lg xs:text-xl sm:text-2xl">
          ${currentWeatherDetails.sunset}
        </div>
      </div>

      <!-- Visibility -->
      <div class="flex justify-between items-center font-semibold pt-1 pb-0.5 xs:py-2">
        <div class="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-6 h-6 pb-0.5 sm:w-8 sm:h-8 sm:pb-0.5"
            viewBox="0 0 16 16">
            <path
              d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
          </svg>
          <p class="text-base xs:text-lg sm:text-xl">
            Visibility
          </p>
        </div>

        <div class="text-lg xs:text-xl sm:text-2xl">
          ${currentWeatherDetails.visibility}
        </div>
      </div>
      
      <!-- Wind Speed -->
      <div class="flex justify-between items-center font-semibold pt-1 pb-0.5 xs:py-2">
        <div class="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-6 h-6 pb-0.5 sm:w-8 sm:h-8 sm:pb-0.5"
            viewBox="0 0 16 16">
            <path
              d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5zm-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2zM0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5z" />
          </svg>
          <p class="text-base xs:text-lg sm:text-xl">
            Wind Speed
          </p>
        </div>

        <div class="text-lg xs:text-xl sm:text-2xl">
          ${currentWeatherDetails.windSpeed}
        </div>
      </div>
      
    </div>
  `

  selector.thirdInfoContainer.innerHTML = thirdInfo;
};

export {
  selector,
  preventTransitionOnWindowLoad,
  loadStoredTheme,
  toggleTheme,
  displayCityFirstInformation,
  displayCitySecondInformation,
  displayCityThirdInformation,
};