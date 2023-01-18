import dom from './dom';

export default function toggleBtn(): void {
  window.onload = () => {
    document.body.classList.remove('transition');
  };

  let theme: string;

  if (localStorage.getItem('theme')) {
    theme = JSON.parse(localStorage.getItem('theme'));
  } else {
    theme = 'light';
  }

  if (theme === 'light') {
    dom.themeToggleBtn.classList.remove('theme-toggle--toggled');
    dom.html.classList.remove('dark');
  } else if (theme === 'dark') {
    dom.themeToggleBtn.classList.add('theme-toggle--toggled');
    dom.html.classList.add('dark');
  }

  localStorage.setItem('theme', JSON.stringify(theme));

  dom.themeToggleBtn.onclick = () => {
    dom.themeToggleBtn.classList.toggle('theme-toggle--toggled');
    
    if (dom.themeToggleBtn.classList.contains('theme-toggle--toggled')) {
      dom.html.classList.add('dark');
      theme = 'dark';
    } else {
      dom.html.classList.remove('dark');
      theme = 'light';
    }

    localStorage.setItem('theme', JSON.stringify(theme));
  };
}