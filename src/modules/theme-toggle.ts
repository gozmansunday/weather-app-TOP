const html = document.querySelector('html') as HTMLHtmlElement;
const themeToggleBtn = document.querySelector('#theme-toggle-btn') as HTMLButtonElement;

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
    themeToggleBtn.classList.remove('theme-toggle--toggled');
    html.classList.remove('dark');
  } else if (theme === 'dark') {
    themeToggleBtn.classList.add('theme-toggle--toggled');
    html.classList.add('dark');
  }

  localStorage.setItem('theme', JSON.stringify(theme));

  themeToggleBtn.onclick = () => {
    themeToggleBtn.classList.toggle('theme-toggle--toggled');
    
    if (themeToggleBtn.classList.contains('theme-toggle--toggled')) {
      html.classList.add('dark');
      theme = 'dark';
    } else {
      html.classList.remove('dark');
      theme = 'light';
    }

    localStorage.setItem('theme', JSON.stringify(theme));
  };
};