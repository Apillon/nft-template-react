/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      mobile: { max: '767px' },
      tablet: { max: '1023px' },
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      hd: '1920px'
    },

    colors: {
      primary: '#F9FF73',
      secondary: '#78DCE8',

      black: '#000000',
      white: '#FFFFFF',
      yellow: '#F9FF73',
      orange: '#F7AF39',
      green: '#A9DC76',
      violet: '#AB9DF2',
      blue: '#78dce8',

      bg: '#f0f2da',
      bgDark: '#141721'
    },

    fontFamily: {
      sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui'],
      inter: ['Inter', 'ui-sans-serif', 'system-ui']
    },

    container: {
      center: true,
      screens: {
        lx: '1440px'
      },
      padding: {
        DEFAULT: '1rem'
      }
    },

    extend: {
      gridTemplateColumns: {
        nft: 'repeat(auto-fill, minmax(220px, 1fr))',
        large: 'repeat(auto-fill, minmax(280px, 1fr))',
        small: 'repeat(auto-fill, minmax(180px, 1fr))'
      },
      zIndex: {
        1: 1,
        2: 2,
        3: 3
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
}
