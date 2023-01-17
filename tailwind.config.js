/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/**/*.{html,js}', './src/**/*.{html,js}'],

  future: {
    hoverOnlyWhenSupported: true,
  },

  darkMode: 'class',

  theme: {
    screens: {
      xs: '356px',
      sm: '412px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
      '2xl': '1800px',
    },
    extend: {
      colors: {
        colorName: '#color',
      },
      fontFamily: {
        mona: ['Mona Sans', 'sans-serif'],
        hubot: ['Hubot Sans', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        bebas: ['Bebas Neue', 'cursive'],
      },
      boxShadow: {
        shadow: '0px 0px 0px 0px rgba(0, 0, 0, 0.0)',
      },
    },
  },

  plugins: [],
};
