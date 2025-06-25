import { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Fade,
  Zoom,
  IconButton,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Message from "./Message";
import InputArea from "./InputArea";
import LoadingDots from "./LoadingDots";
import { v4 as uuidv4 } from "uuid";

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const messagesEndRef = useRef(null);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm Hexaa AI. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }, 800);
  }, []);

  const [userId] = useState(() => {
    const storedId = sessionStorage.getItem("user_id");
    if (storedId) return storedId;
    const newId = uuidv4();
    sessionStorage.setItem("user_id", newId);
    return newId;
  });

  const handleSendMessage = async (message) => {
    if (!message?.trim() || chatEnded) return;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const newUserMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    const requestPayload = {
      text: message,
      user_id: userId,
      time_zone: timeZone,
    };

    try {
      const [answerRes, leadRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/webhook/answer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...requestPayload,
            top_k: 3,
            min_score: 0.1,
            include_source: false,
            use_query_refinement: true,
          }),
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/webhook/lead`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([{ body: requestPayload }]),
        }),
      ]);

      const data = await answerRes.json();
      const rawOutput = data.output || "";
      const outputMatch = rawOutput.match(/Output:\s*([\s\S]*)/);
      const cleanedOutput = outputMatch ? outputMatch[1].trim() : "";

      const newBotMessage = {
        id: Date.now() + 1,
        text:
          cleanedOutput ||
          "I'm here to help! Could you please clarify your question?",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Oops! Something went wrong. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = async () => {
    setIsTyping(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/webhook/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: userId }),
        }
      );

      if (response.ok) {
        setMessages([
          {
            id: 1,
            text: "Hello! I'm Hexaa AI. How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        setChatEnded(false);
        setSnackbar({
          open: true,
          message: "Chat cleared successfully.",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Chat clear failed.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error resetting chat.",
        severity: "error",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndChat = () => {
    setFeedbackOpen(true);
  };

  const handleSubmitFeedback = async () => {
    setFeedbackLoading(true);
    const now = new Date();

    const payload = {
      key: userId,
      thumb_response: feedback === "up" ? "up" : "down",
      message: feedbackText || "",
      date: now.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: now.toTimeString().slice(0, 5),
      monthYear: now.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/webhook/collect-metrics`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed");

      setSnackbar({
        open: true,
        message: "Feedback submitted successfully!",
        severity: "success",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "The chat has ended.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setChatEnded(true);
    } catch (error) {
      console.error("Feedback error:", error);
      setSnackbar({
        open: true,
        message: "Failed to submit feedback.",
        severity: "error",
      });
    } finally {
      setFeedbackLoading(false);
      setFeedbackOpen(false);
      setFeedback(null);
      setFeedbackText("");
    }
  };

  const showSuggestions = !isTyping && !chatEnded;

  const handleSuggestionClick = (text) => {
    handleSendMessage(text);
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
          borderRadius: "16px",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            background: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                mr: 2,
              }}
            >
              AI
            </Box>
            <Typography variant="h6" fontWeight="600">
              Hexaa Assistant
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={handleEndChat}
            disabled={chatEnded}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontSize: "0.75rem",
            }}
          >
            End Chat
          </Button>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 2,
            background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
          }}
        >
          {messages.map((message, index) => (
            <Fade in key={message.id} timeout={300}>
              <Box>
                <Message
                  text={message.text}
                  sender={message.sender}
                  timestamp={message.timestamp}
                  isFirst={index === 0}
                />
              </Box>
            </Fade>
          ))}
          {isTyping && (
            <Zoom in>
              <Box sx={{ display: "flex", pl: 6, py: 1 }}>
                <LoadingDots />
              </Box>
            </Zoom>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {showSuggestions && (
          <Box
            sx={{
              px: 2,
              pt: 1,
              pb: 0,
              backgroundColor: "white",
              borderTop: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Stack direction="row" spacing={1}>
              {[
                "I want an estimate",
                "I want to schedule meeting with an expert",
                "What are Hexaa AI services?",
              ].map((text, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant="outlined"
                  onClick={() => handleSuggestionClick(text)}
                  sx={{
                    opacity: 0.6,
                    borderRadius: 2,
                    fontSize: "0.75rem",
                    textTransform: "none",
                    borderColor: "rgba(0,0,0,0.1)",
                    color: "text.primary",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      color: "#000", // darker text on hover
                      opacity: 1,
                      borderColor: "rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  {text}
                </Button>
              ))}
            </Stack>
          </Box>
        )}

        {!chatEnded && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderTop: "1px solid rgba(0,0,0,0.05)",
              backgroundColor: "white",
            }}
          >
            <IconButton
              onClick={handleResetChat}
              size="small"
              disabled={isTyping}
              sx={{
                mr: 1,
                color: "primary.main",
                border: "1px solid",
                borderColor: "primary.light",
                borderRadius: 2,
                p: 1,
              }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <InputArea
                onSendMessage={handleSendMessage}
                maxLength={500}
                disabled={isTyping}
              />
            </Box>
          </Box>
        )}
      </Paper>

      <Dialog
        open={feedbackOpen}
        onClose={() => !feedbackLoading && setFeedbackOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>How was your experience?</DialogTitle>
        <DialogContent>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 1 }}
          >
            <IconButton
              onClick={() => setFeedback("up")}
              color={feedback === "up" ? "primary" : "default"}
              disabled={feedbackLoading}
            >
              <ThumbUpIcon />
            </IconButton>
            <IconButton
              onClick={() => setFeedback("down")}
              color={feedback === "down" ? "primary" : "default"}
              disabled={feedbackLoading}
            >
              <ThumbDownIcon />
            </IconButton>
          </Stack>
          <TextField
            label="Additional comments (optional)"
            multiline
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            fullWidth
            margin="normal"
            disabled={feedbackLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmitFeedback}
            variant="contained"
            disabled={!feedback || feedbackLoading}
          >
            {feedbackLoading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatContainer;
