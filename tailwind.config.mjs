/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: '#F7D604',
        'brand-dark': '#d4b503',
      },
    },
  },
  plugins: [],
};
