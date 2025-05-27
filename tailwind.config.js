/** @type {import('tailwindcss').Config} */
export default {
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
      hd: '1920px',
    },

    colors: {
      primary: '#F9FF73',
      secondary: '#78DCE8',
      transparent: 'transparent',

      black: '#000000',
      white: '#FFFFFF',
      yellow: '#F9FF73',
      orange: '#F7AF39',
      green: '#A9DC76',
      violet: '#AB9DF2',
      blue: '#78dce8',

      bg: '#f0f2da',
      bgDark: '#141721',
      bgDarker: '#141721',

      grey: {
        DEFAULT: '#ccc',
        transparent: 'rgba(153, 153, 153, 0.64)', // #99999a3
        dark: '#141721', // rgba(20, 23, 33, 1)
        darker: '#1e212b', // rgba(30, 33, 43, 1)
        darkerTransparent: 'rgba(30, 33, 43, 0.64)', // #1e212ba3
      },
    },

    fontFamily: {
      sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui'],
      inter: ['Inter', 'ui-sans-serif', 'system-ui'],
    },

    container: {
      center: true,
      screens: {
        xs: '400px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
        hd: '1920px',
      },
      padding: {
        DEFAULT: '1rem',
      },
    },

    extend: {
      gridTemplateColumns: {
        nft: 'repeat(auto-fill, minmax(220px, 1fr))',
        large: 'repeat(auto-fill, minmax(280px, 1fr))',
        small: 'repeat(auto-fill, minmax(180px, 1fr))',
      },
      zIndex: {
        1: 1,
        2: 2,
        3: 3,
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
