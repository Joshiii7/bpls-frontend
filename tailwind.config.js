/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Single system-wide font family (public site, applicant area, and admin
      // alike) — see styles.css for the matching PrimeNG override.
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'hero-section': "url('src/assets/images/banner/cedo-background-1500.webp')",
        'logo': "url('src/assets/images/logo/bislig lgu logo.png')",
      },
      boxShadow: {
        'inner-custom': 'inset 0 .1rem .5rem rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'bg-scroll': 'bgScroll 20s ease-in-out infinite',
        'obj-scroll': 'objScroll 20s ease-in-out infinite',
      },
      keyframes: {
        bgScroll: {
          '0%, 100%': { backgroundPosition: 'center top' },
          '50%': { backgroundPosition: 'center bottom' },
        },
        // Same slow pan effect as bgScroll, for an <img> using object-position
        // instead of a CSS background-image (needed so the hero photo can use
        // responsive srcset, which background-image can't do).
        objScroll: {
          '0%, 100%': { objectPosition: 'center top' },
          '50%': { objectPosition: 'center bottom' },
        },
      },
      colors: {
        'primary': '#009800',
        'primary-dark': '#007a00',
      },
    },
  },
  plugins: [],
}

