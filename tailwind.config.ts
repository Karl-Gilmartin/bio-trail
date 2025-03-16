import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        castletonGreen: "#005236ff",
        jade: "#24B469ff",
        celadon: "#ADE4C8ff",
        mintGreen: "#C7E6D7ff",
        darkGreen: "#053525ff",
        cambridgeBlue: "#7A9889ff",
        darkSlateGray: "#085352ff"

      }
    },
  },
  plugins: [],
} satisfies Config;
/* CSS HEX */
// --castleton-green: #005236ff;
// --jade: #24B469ff;
// --celadon: #ADE4C8ff;
// --mint-green: #C7E6D7ff;
// --dark-green: #053525ff;


// /* CSS HEX */
// --cambridge-blue: #7A9889ff;
// --cambridge-blue-2: #7B998Aff;
// --dark-slate-gray: #085352ff;
// --white-smoke: #F1F4F2ff;
// --cambridge-blue-3: #93AC9Fff;
