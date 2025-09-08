/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 70%, 50%)',
        accent: 'hsl(160, 70%, 50%)',
        bg: 'hsl(210, 36%, 96%)',
        surface: 'hsl(210, 36%, 98%)',
        text: 'hsl(210, 30%, 15%)',
        muted: 'hsl(210, 30%, 35%)',
        'islamic-green': 'hsl(120, 60%, 45%)',
        'islamic-gold': 'hsl(45, 90%, 60%)',
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
      },
      borderRadius: {
        'input': '8px',
        'button': '6px',
        'card': '12px',
      },
      spacing: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(210, 30%, 15%, 0.1)',
      },
    },
  },
  plugins: [],
}
