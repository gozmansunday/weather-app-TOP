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

export {
  selector,
  preventTransitionOnWindowLoad,
  loadStoredTheme,
  toggleTheme,
  displayCityFirstInformation,
  displayCitySecondInformation,
};