module.exports = {
  purge: [],
  theme: {
    fontFamily: {
      header: ['futura-pt'],
      body: ['futura-pt'],
    },
    colors: {
      transparent: 'transparent',
      black: '#131313',
      white: '#fff',
      gray: {
        '100': '#FFFFFF',
        '200': '#F4F4F4',
        '300': '#E3E5E7',
        '400': '#CFD1CS',
        '500': '#BCC1CB',
        '600': '#848D9A',
        '700': '#646B74',
        '800': '#424242',
        '900': '#131313',
      },
      teal: {
        '100': '#EDF8FA',
        '200': '#7EC8D0',
        '300': '#62AEBS',
        '400': '#43939B',
        '500': '#46878E',
        '600': '#437B81',
        '700': '#285E64',
        '800': '#2D4B4E',
        '900': '#223426',
      },
      blue: {
        '100': '#B1C3D9',
        '200': '#7E95B1',
        '300': '#49688B',
        '400': '#364D67',
        '500': '#314457',
        '600': '#293A46',
        '700': '#26343E',
        '800': '#1E272F',
        '900': '#1E2B34',
      },
      red: {
        '500': '#D02727',
      },
    },
    extend: {
      width: {
        '72': '300px',
      },
    },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': {'min': '768px', 'max': '1023px'},
      // => @media (min-width: 768px, max-width: 1023px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1441px',
      // => @media (min-width: 1441px) { ... }
    }
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
    border: ['responsive', 'hover', 'focus', 'active', 'disabled'],
    borderColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
    color: ['responsive', 'hover', 'focus', 'active', 'disabled'],
    textColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
    transform: ['responsive', 'hover', 'focus', 'active', 'disabled'],
  },
  plugins: []
};
