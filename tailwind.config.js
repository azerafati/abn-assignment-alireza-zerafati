/** @type {import('tailwindcss').Config} */

// https://material.angular.io/cdk/layout/overview#predefined-breakpoints
const breakpoints = {
  xs: '480px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1600px',
  xxl: '1920px',
}

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    screens: breakpoints,
    containers: breakpoints,
    extend: {},
  },
  plugins: [],
}
