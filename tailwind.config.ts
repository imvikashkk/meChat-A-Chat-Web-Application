import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }

      xs: { max: "452px" },
      // => @media (max-width: 452px) { ... }

      xxs: { max: "352px" },
      // => @media (max-width: 352px) { ... }
    },
    extend: {
      boxShadow: {
        'topDark': '2px -4px 6px -1px rgba(250, 250, 250, 0.15)',
        'top': '2px -4px 6px -1px rgba(10, 10, 10, 0.15)',
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['responsive', 'hover', 'focus', 'active', 'group-hover', 'top'],
    },
  },
  plugins: [require("daisyui")],
};
export default config;
