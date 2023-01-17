const html = document.querySelector('html') as HTMLHtmlElement;
const themeToggleBtn = document.querySelector('#theme-toggle-btn') as HTMLButtonElement;

const toggleBtn = (): void => {
  themeToggleBtn.onclick = () => {
    themeToggleBtn.classList.toggle('theme-toggle--toggled');
    
    if (themeToggleBtn.classList.contains('theme-toggle--toggled')) {
      html.classList.add('dark');
      console.log('dark!');
    } else {
      html.classList.remove('dark');
      console.log('not dark!');
    }
  };

};

export default toggleBtn;