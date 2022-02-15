// eslint-disable-next-line @typescript-eslint/no-var-requires
const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        84: '21rem',
      },
      colors: {
        purple: {
          ...colors.purple,
          300: '#AC73E7',
          400: '#824DBD',
          600: '#31006e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
