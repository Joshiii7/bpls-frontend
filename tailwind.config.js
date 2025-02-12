/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-section': "url('src/assets/images/cedo_background.jpg')",
        'logo': "url('src/assets/images/logo/bislig lgu logo.png')",
      },
      boxShadow: {
        'inner-custom': 'inset 0 4px 10px 2px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'bg-scroll': 'bgScroll 20s ease-in-out infinite',
      },
      keyframes: {
        bgScroll: {
          '0%, 100%': { backgroundPosition: 'center top' },
          '50%': { backgroundPosition: 'center bottom' },
        },
      },
    },
  },
  plugins: [],
}

