/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: '#FFA500',
        orangeHover: '#FF8C00',
        black: '#000112',
        darkBg: '#20212C',
        darkGrey: '#2B2C37',
        linesDark: '#3E3F4E',
        mediumGrey: '#828FA3',
        linesLight: '#E4EBFA',
        lightBg: '#F4F7FD',
        white: '#FFFFFF',
        red: '#EA5555',
        redHover: '#FF9898',
      },
      fontFamily: {
        sans: ['Roboto'] 
      },
      fontSize: {
        hS: '14px',
        hM: '17px',
        hL: '20px',
        hXL: '26px',
      }
    }
  }
}
