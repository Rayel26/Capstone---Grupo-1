/** @type {import('tailwindcss').Config} */
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
    },
  },
  plugins: [],
  darkMode: 'class',
}


  