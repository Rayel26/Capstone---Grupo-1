/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './templates/**/*.html',
    './static/styles/**/*.css',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'logo-gativet': "url('/static/img/Logo Gativet.png')",
      },
      backgroundSize: {
        'cover': 'cover',
        'contain': 'contain',
      },
      colors: {
        'green-dark': '#02d4ba',
      },
    },
  },
  plugins: [plugin(function({ addUtilities, theme }) {
    const shadows = theme('boxShadow');
    const newShadows = {
      '.hover\\:shadow-green-dark:hover': {
        '--tw-shadow-color': theme('colors.green-dark'),
        '--tw-shadow': 'var(--tw-shadow-colored)',
      },
    };

    addUtilities(newShadows, ['responsive', 'hover']);
  }),
],
  darkMode: 'class',
}


  