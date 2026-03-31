/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#00ffff',
        'secondary': '#8b5cf6',
        'accent': '#00ff88',
        'background-light': '#f5f8f8',
        'background-dark': '#010409',
        'card-dark': '#030815',
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'sans': ['Space Grotesk', 'sans-serif']
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
    },
  },
  plugins: [],
}
