import { Box } from "@mui/material";

const LoadingDots = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: 24,
        "& > div": {
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "primary.main",
          margin: "0 3px",
          animation: "bounce 1.4s infinite ease-in-out both",
        },
        "& > div:nth-of-type(1)": { animationDelay: "0.32s" },
        "& > div:nth-of-type(2)": { animationDelay: "0.16s" },
        "@keyframes bounce": {
          "0%, 80%, 100%": { transform: "scale(0.5)", opacity: 0.3 },
          "40%": { transform: "scale(1)", opacity: 1 },
        },
      }}
    >
      <div />
      <div />
      <div />
    </Box>
  );
};

export default LoadingDots;
