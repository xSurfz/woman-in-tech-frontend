/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wit': {
          purple: '#5C1D8C',      // primario
          purpleLight: '#8B5CF6', // secundario
          dark: '#1F2937',        // texto principal
          gray: '#6B7280',        // texto secundario
          grayLight: '#F9FAFB',   // fondos alternos
          success: '#10B981',
          alert: '#F59E0B',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}