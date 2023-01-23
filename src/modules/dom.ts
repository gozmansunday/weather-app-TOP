import * as interfaces from '../index';

const selector = {
  html: document.querySelector('html') as HTMLHtmlElement,
  searchForm: document.querySelector('#search-form') as HTMLFormElement,
  citySearch: document.querySelector('#city-search') as HTMLInputElement,
  searchSubmitBtn: document.querySelector('#search-submit-btn') as HTMLButtonElement,
  themeToggleBtn: document.querySelector('#theme-toggle-btn') as HTMLButtonElement,
  unitToggleBtn: document.querySelector('#toggle') as HTMLInputElement,
  firstInfoContainer: document.querySelector('#first-info-container') as HTMLDivElement,
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

export {
  selector,
  preventTransitionOnWindowLoad,
  loadStoredTheme,
  toggleTheme,
  displayCityFirstInformation,
};