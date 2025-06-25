import { createTheme } from "@mui/material/styles";

export default createTheme({
  palette: {
    primary: {
      main: "#6366f1", // Indigo
      light: "#a5b4fc",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#10b981", // Emerald
      light: "#6ee7b7",
      dark: "#059669",
    },
    background: {
      default: "#f9fafb", // Cool gray
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
  },
});
