/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'siberdark': '#020806',
        'siberdark-2': '#04100a',
        'sibersurface': '#07150e',
        'sibersurface-2': '#0a1d13',
        'siberborder': '#103a26',
        'siberborder-soft': '#0c2719',
        'sibergreen': '#00ff88',
        'sibergreen-2': '#00d978',
        'sibermint': '#5cffba',
        'sibertext': '#cdeede',
        'sibermuted': '#74998a',
        'siberdim': '#3d564b',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        disp: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sibergreen': '0 0 18px -4px rgba(0, 255, 136, 0.55)',
        'siberhover': '0 0 28px -4px rgba(0, 255, 136, 0.55)',
      },
      animation: {
        pulse: 'pulse 1.6s infinite',
      },
    },
  },
  plugins: [],
};
