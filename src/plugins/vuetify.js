import "vuetify/styles";
import { createVuetify } from "vuetify";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "bcnTheme",
    themes: {
      bcnTheme: {
        dark: false,
        colors: {
          background: "#F7FAFF",
          surface: "#FFFFFF",
          primary: "#1F4A8A",
          secondary: "#E5B64F",
          accent: "#F2A7A2",
          info: "#6CA6F6",
          success: "#2FB27C",
          warning: "#F1B24A",
          error: "#E46D6D"
        }
      }
    }
  },
  defaults: {
    VBtn: {
      rounded: "xl",
      size: "large"
    },
    VCard: {
      rounded: "xl",
      elevation: 6
    },
    VChip: {
      rounded: "lg"
    }
  }
});

export default vuetify;
