import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxHeight: {
        "screen-content": "calc(100svh - 4rem);",
      },
      minHeight: {
        "screen-content": "calc(100svh - 4rem)",
      },
      backgroundImage: {
        "hero-image":
          "url('/assets/img/hero-banner-img-min.jpg'), url('/assets/img/hero-banner-img-fallback-small-3.jpg')",
        "hero-image-fallback":
          "url('/assets/img/hero-banner-img-fallback-small-3.jpg')",
      },
      colors: {
        primary: {
          DEFAULT: "#0071bc",
          semi: "#0060A0",
          dark: "#030926",
        },
        secondary: "#fef200",
        accent: "#ef4444",
        black: "#26272c",
        white: "#fff",
      },
      screens: {
        xs: "391px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#0071bc",
          secondary: "#fef200",
          accent: "#ef4444",
          neutral: "#3d4451",
          "base-100": "#ffffff",
        },
      },
    ],
  },
});
