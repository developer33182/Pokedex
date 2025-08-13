/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your file structure
    ],
    darkMode: "class", // Enables toggling dark mode via a class
    theme: {
      extend: {
        colors: {
          // Magic: The Gathering Colors
          whiteMana: '#FFFFFF',
          blueMana: '#2D4B9B',
          lightBlueMana: '#75A9D4',
          darkBlueMana: '#1A3454',
          blackMana: '#2D2A2A',
          darkGrayBlackMana: '#6E6A6A',
          bloodRedBlackMana: '#BC1B25',
          redMana: '#F25A29',
          burntRedMana: '#D14B3A',
          pureRedMana: '#FF0000',
          greenMana: '#4B9B3F',
          limeGreenMana: '#85C241',
          lightGreenMana: '#A8D8A0',
          darkGreenMana: '#2B7A2D',
          // Custom Colors
          // Reds
     
          deepGreenMana: '#2B7A2D',
          // Neutrals
          neutralGray: '#B0B0B0',
          lightGray: '#F4F4F4',
          darkText: '#333333',
          lightText: '#FFFFFF',


        }
        // Add any other custom utilities here
      },
    },
    plugins: [],
  };