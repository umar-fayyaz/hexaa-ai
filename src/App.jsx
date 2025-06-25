import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
} from "@mui/material";
import theme from "./styles/theme";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Box py={3}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            color="primary"
          >
            Hexaa Ai Bot
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Chatbot />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
