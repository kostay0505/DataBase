/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0d1117',
          secondary: '#161b22',
          card: '#21262d',
        },
        border: '#30363d',
        accent: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
          muted: '#8b5cf620',
        },
      },
    },
  },
  plugins: [],
}
