// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#EEEFE9",
        "surface": "#EEEFE9",
        "surface-dim": "#DCDDD4",
        "surface-bright": "#FFFFFF",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F4F5EF",
        "surface-container": "#E7E8E1",
        "surface-container-high": "#DEDFD6",
        "surface-container-highest": "#D3D4C9",

        "primary": "#14140F",
        "on-primary": "#FFFFFF",
        "primary-container": "#E7E8E1",
        "on-primary-container": "#14140F",
        "primary-fixed": "#E7E8E1",
        "primary-fixed-dim": "#D3D4C9",
        "on-primary-fixed": "#14140F",
        "on-primary-fixed-variant": "#3A3A32",

        "secondary": "#6B6A5F",
        "on-secondary": "#FFFFFF",
        "secondary-container": "#E7E8E1",
        "on-secondary-container": "#3A3A32",
        "secondary-fixed": "#E7E8E1",
        "secondary-fixed-dim": "#C7C8BC",
        "on-secondary-fixed": "#14140F",
        "on-secondary-fixed-variant": "#3A3A32",

        "tertiary": "#8A8879",
        "on-tertiary": "#FFFFFF",
        "tertiary-container": "#E7E8E1",
        "on-tertiary-container": "#4A4940",
        "tertiary-fixed": "#E7E8E1",
        "tertiary-fixed-dim": "#C7C8BC",
        "on-tertiary-fixed": "#14140F",
        "on-tertiary-fixed-variant": "#4A4940",

        "on-background": "#14140F",
        "on-surface": "#14140F",
        "on-surface-variant": "#6B6A5F",
        "outline": "#8A8879",
        "outline-variant": "#D9DAD1",

        "inverse-surface": "#2A2A24",
        "inverse-on-surface": "#EEEFE9",
        "inverse-primary": "#D3D4C9",
        "surface-tint": "#14140F",

        "error": "#BA1A1A",
        "on-error": "#FFFFFF",
        "error-container": "#FFDAD6",
        "on-error-container": "#93000A",
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      spacing: {
        "xxl": "48px",
        "lg": "24px",
        "xl": "32px",
        "xs": "4px",
        "sm": "8px",
        "margin-mobile": "20px",
        "margin-desktop": "40px",
        "base": "4px",
        "md": "16px",
        "gutter": "16px"
      },
      fontFamily: {
        "label-caps": ["Manrope", "sans-serif"],
        "headline-lg": ["Manrope", "sans-serif"],
        "body-lg": ["Manrope", "sans-serif"],
        "button": ["Manrope", "sans-serif"],
        "body-sm": ["Manrope", "sans-serif"],
        "headline-md": ["Manrope", "sans-serif"],
        "headline-lg-mobile": ["Manrope", "sans-serif"],
      },
      fontSize: {
        "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.06em", "fontWeight": "600"}],
        "headline-lg": ["32px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "button": ["15px", {"lineHeight": "20px", "fontWeight": "600"}],
        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "700"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "30px", "letterSpacing": "-0.02em", "fontWeight": "800"}]
      }
    },
  },
  plugins: [],
}