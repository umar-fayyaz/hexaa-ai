import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const InputArea = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        borderTop: "1px solid rgba(0,0,0,0.05)",
        background: "white",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Message Hexaa..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "24px",
            backgroundColor: "rgba(0,0,0,0.02)",
            transition: "all 0.3s ease",
            borderColor: isFocused ? "primary.main" : "transparent",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
            "&.Mui-focused": {
              backgroundColor: "white",
              boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.2)",
            },
          },
          "& .MuiOutlinedInput-input": {
            py: 1.5,
            fontSize: "0.9rem",
          },
        }}
      />

      {message && (
        <IconButton
          type="submit"
          color="primary"
          disabled={disabled}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default InputArea;
