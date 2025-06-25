import { Box, Typography, Paper, Avatar } from "@mui/material";
import { format } from "date-fns";

const Message = ({ text, sender, timestamp, isFirst }) => {
  const isUser = sender === "user";

  // Utility: Handles **bold** and detects links
  const parseInlineElements = (text, isUser) => {
    const parts = text.split(/(\*\*[^*]+\*\*)|(https?:\/\/[^\s]+)/g);

    return parts.map((part, idx) => {
      if (!part) return null;

      // Bold
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={idx}
            style={{ fontWeight: 600, color: isUser ? "white" : "inherit" }}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Link
      if (/^https?:\/\/[^\s]+$/.test(part)) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: isUser ? "#cfdfff" : "#3f51b5",
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            {part}
          </a>
        );
      }

      return part;
    });
  };

  // Bullet list rendering
  const renderBulletList = (text) => {
    const lines = text
      .split("\n")
      .filter((line) => line.trim().startsWith("*"));

    return (
      <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^\*\s*/, ""); // Only removes leading '* ' and preserves '**'
          return (
            <li key={idx} style={{ marginBottom: "6px" }}>
              <Typography
                sx={{
                  color: isUser ? "white" : "text.primary",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                {parseInlineElements(cleanLine, isUser)}
              </Typography>
            </li>
          );
        })}
      </ul>
    );
  };

  // Full message with paragraphs, bullets, and inline formatting
  const renderFormattedMessage = (text) => {
    const paragraphs = text.split("\n\n").filter((p) => p.trim() !== "");

    return paragraphs.map((para, idx) => {
      const isBulletList = para.trim().startsWith("*");
      const lines = para.split("\n");

      return (
        <Box key={idx} sx={{ mb: idx < paragraphs.length - 1 ? 1.5 : 0 }}>
          {isBulletList
            ? renderBulletList(para)
            : lines.map((line, lineIdx) => (
                <Box key={lineIdx} component="span">
                  <Typography
                    component="span"
                    sx={{
                      color: isUser ? "white" : "text.primary",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      display: "block",
                    }}
                  >
                    {parseInlineElements(line, isUser)}
                  </Typography>
                </Box>
              ))}
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
        transition: "all 0.3s ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "flex-end",
          maxWidth: { xs: "90%", sm: "80%" },
          gap: 1,
        }}
      >
        {!isUser && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: isFirst ? "primary.main" : "secondary.main",
              color: "white",
              fontSize: "0.875rem",
            }}
          >
            {isFirst ? "AI" : "HX"}
          </Avatar>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: isUser ? "primary.main" : "background.paper",
            borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
            border: !isUser ? "1px solid rgba(0,0,0,0.05)" : undefined,
            boxShadow: isUser
              ? "0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -2px rgba(99, 102, 241, 0.2)"
              : "0 1px 3px 0 rgba(0,0,0,0.04)",
          }}
        >
          {renderFormattedMessage(text)}

          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: isUser ? "left" : "right",
              color: isUser ? "primary.100" : "text.secondary",
              opacity: 0.8,
              mt: 1,
              fontSize: "0.7rem",
            }}
          >
            {format(new Date(timestamp), "hh:mm a")}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Message;
