import * as dom from './dom';

export default function toggleBtn(): void {
  dom.preventTransitionOnWindowLoad();
  let theme: string;

  if (localStorage.getItem('theme')) {
    theme = JSON.parse(localStorage.getItem('theme'));
  } else {
    theme = 'light';
  }

  dom.loadStoredTheme(theme);
  localStorage.setItem('theme', JSON.stringify(theme));

  dom.selector.themeToggleBtn.onclick = () => {
    dom.toggleTheme(theme);
    localStorage.setItem('theme', JSON.stringify(theme));
  };
};
