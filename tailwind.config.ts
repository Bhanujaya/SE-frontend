import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'customGray': '#fafbfc',
        'customDarkBlue': '#111F34',
        'customLightBLue': '#47566C',
        'customLightPurple': '#D5D7FF',
        'customPurple': '#8589F8',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        '3xl': '0 20px 25px rgba(0, 0, 0, 0.25)',
        '4xl': '0 10px 70px rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'login-background': "url('/Background.png')",
      },
    },
  },
  plugins: [],
}
export default config
