// tailwind.config.js

/*
  CampusFind palette (4 colors, plus lighter/darker tints of them)
  ---------------------------------------------------------------
  paper   #EDEDE8  background
  ink     #17172E  text, outlines, dark sections
  lime    #D4F26A  accent 1 (main highlight, buttons, active states)
  violet  #A58BF0  accent 2 (secondary highlight)

  The only exception is "error" red, kept for delete / danger actions.
*/

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- the 4 brand colors (use these in new code) ----
        "paper": "#EDEDE8",
        "ink": "#17172E",
        "lime": {
          DEFAULT: "#D4F26A",
          soft: "#EEF8C7",
        },
        "violet": {
          DEFAULT: "#A58BF0",
          soft: "#E4DCFB",
        },

        // ---- existing theme names, remapped to the palette ----
        "background": "#EDEDE8",
        "surface": "#EDEDE8",
        "surface-dim": "#DADAD3",
        "surface-bright": "#F9F9F7",
        "surface-container-lowest": "#F9F9F7",
        "surface-container-low": "#F4F4F0",
        "surface-container": "#E4E4DE",
        "surface-container-high": "#DADAD3",
        "surface-container-highest": "#CFCFC7",

        "primary": "#17172E",
        "on-primary": "#F9F9F7",
        "primary-container": "#D4F26A",
        "on-primary-container": "#17172E",
        "primary-fixed": "#E4DCFB",
        "primary-fixed-dim": "#C9B8F6",
        "on-primary-fixed": "#17172E",
        "on-primary-fixed-variant": "#3A3A55",

        "secondary": "#5C5C70",
        "on-secondary": "#F9F9F7",
        "secondary-container": "#EEF8C7",
        "on-secondary-container": "#17172E",
        "secondary-fixed": "#EEF8C7",
        "secondary-fixed-dim": "#DDEF9C",
        "on-secondary-fixed": "#17172E",
        "on-secondary-fixed-variant": "#3A3A55",

        "tertiary": "#A58BF0",
        "on-tertiary": "#17172E",
        "tertiary-container": "#E4DCFB",
        "on-tertiary-container": "#17172E",
        "tertiary-fixed": "#E4DCFB",
        "tertiary-fixed-dim": "#C9B8F6",
        "on-tertiary-fixed": "#17172E",
        "on-tertiary-fixed-variant": "#3A3A55",

        "on-background": "#17172E",
        "on-surface": "#17172E",
        "on-surface-variant": "#5C5C70",
        "outline": "#8B8B99",
        "outline-variant": "#D3D3CC",

        "inverse-surface": "#17172E",
        "inverse-on-surface": "#EDEDE8",
        "inverse-primary": "#D4F26A",
        "surface-tint": "#17172E",

        "error": "#C2362B",
        "on-error": "#F9F9F7",
        "error-container": "#FBE3E0",
        "on-error-container": "#7A1A13",
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      boxShadow: {
        // the chunky offset shadow from the mockup
        "pop-sm": "3px 3px 0 0 #17172E",
        "pop": "4px 4px 0 0 #17172E",
        "pop-lg": "6px 6px 0 0 #17172E",
      },
      spacing: {
        "xxl": "48px",
        "lg": "24px",
        "xl": "32px",
        "xs": "4px",
        "sm": "8px",
        "margin-mobile": "20px",
        "margin-desktop": "60px",
        "base": "4px",
        "md": "16px",
        "gutter": "16px"
      },
      fontFamily: {
        // headings: Bricolage Grotesque / body: DM Sans
        "display": ["Bricolage Grotesque", "sans-serif"],
        "headline-lg": ["Bricolage Grotesque", "sans-serif"],
        "headline-lg-mobile": ["Bricolage Grotesque", "sans-serif"],
        "headline-md": ["Bricolage Grotesque", "sans-serif"],
        "label-caps": ["DM Sans", "sans-serif"],
        "body-lg": ["DM Sans", "sans-serif"],
        "body-sm": ["DM Sans", "sans-serif"],
        "button": ["DM Sans", "sans-serif"],
        "inter-bold": ["DM Sans", "sans-serif"],
        "manrope-light": ["DM Sans", "sans-serif"],
        "sans": ["DM Sans", "sans-serif"],
      },
      fontSize: {
        "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.06em", "fontWeight": "700"}],
        "headline-lg": ["28px", {"lineHeight": "34px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "500"}],
        "button": ["15px", {"lineHeight": "20px", "fontWeight": "600"}],
        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "500"}],
        "headline-md": ["20px", {"lineHeight": "26px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "30px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
      }
    },
  },
  plugins: [],
}
