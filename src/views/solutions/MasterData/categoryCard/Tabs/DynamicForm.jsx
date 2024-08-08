import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Chip,
  Divider,
  Container,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SendIcon from "@mui/icons-material/Send";

const initialQuestions = [
  { id: 1, text: "Project name" },
  { id: 2, text: "Detailed scope of work" },
  { id: 3, text: "Expected deliverables" },
  { id: 4, text: "Project start date" },
  { id: 5, text: "Project end date" },
  { id: 6, text: "Estimated budget" },
  { id: 7, text: "Preferred pricing model (e.g., fixed fee, hourly rate)" },
  { id: 8, text: "Job Description" },
  { id: 9, text: "Number of personnel needed" },
  { id: 10, text: "Expertise or qualifications required" },
  { id: 11, text: "Certifications requirements" },
  {
    id: 12,
    text: "Migration of on-premise servers to AWS cloud infrastructure",
  },
];

const StyledButton = styled(Button)(({ theme }) => ({
  borderColor: "#6b6be2",
  color: "#6b6be2",
  "&:hover": {
    backgroundColor: "rgba(107, 107, 226, 0.04)",
    borderColor: "#5a5ad1",
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const DynamicForm = () => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [newQuestion, setNewQuestion] = useState("");

  const handleQuestionSelect = (event) => {
    const question = JSON.parse(event.target.value);
    setSelectedQuestions([...selectedQuestions, question]);
    setAnswers({ ...answers, [question.id]: "" });
  };

  const handleAnswerChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleRemoveQuestion = (id) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q.id !== id));
    const newAnswers = { ...answers };
    delete newAnswers[id];
    setAnswers(newAnswers);
  };

  const handleAddNewQuestion = () => {
    if (newQuestion.trim()) {
      const newId = Math.max(...initialQuestions.map((q) => q.id), 0) + 1;
      const newQuestionObj = { id: newId, text: newQuestion };
      setSelectedQuestions([...selectedQuestions, newQuestionObj]);
      setAnswers({ ...answers, [newId]: "" });
      setNewQuestion("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted answers:", answers);
    alert("Form submitted successfully!");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          color="primary"
          fontWeight="bold"
        >
          Dynamic Project Requirements
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          align="center"
          color="text.secondary"
        >
          Customize your project questionnaire
        </Typography>

        <StyledCard>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Add Questions
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select a predefined question</InputLabel>
              <Select
                label="Select a predefined question"
                onChange={handleQuestionSelect}
                value=""
              >
                <MenuItem value="">
                  <em>Choose a question</em>
                </MenuItem>
                {initialQuestions
                  .filter(
                    (q) => !selectedQuestions.some((sq) => sq.id === q.id)
                  )
                  .map((q) => (
                    <MenuItem key={q.id} value={JSON.stringify(q)}>
                      {q.text}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type a custom question"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <StyledButton
                  fullWidth
                  variant="outlined"
                  onClick={handleAddNewQuestion}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Add
                </StyledButton>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

        <form onSubmit={handleSubmit}>
          {selectedQuestions.map((q) => (
            <StyledCard key={q.id}>
              <CardContent>
                <TextField
                  fullWidth
                  label={q.text}
                  variant="outlined"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  required
                />
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <IconButton
                  onClick={() => handleRemoveQuestion(q.id)}
                  color="error"
                  size="small"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </CardActions>
            </StyledCard>
          ))}

          {selectedQuestions.length > 0 && (
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <StyledButton
                type="submit"
                variant="outlined"
                size="large"
                endIcon={<SendIcon />}
              >
                Submit Questionnaire
              </StyledButton>
            </Box>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default DynamicForm;
