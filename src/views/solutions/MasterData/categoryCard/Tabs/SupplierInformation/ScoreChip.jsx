import React from "react";
import { Chip } from "@mui/material";

const ScoreChip = ({ score, label }) => {
  const getColor = (score) => {
    if (score >= 4.5) return "#4caf50";
    if (score >= 4) return "#8bc34a";
    if (score >= 3.5) return "#ffeb3b";
    if (score >= 3) return "#ffc107";
    return "#f44336";
  };
  const numericScore = parseFloat(score);
  const displayScore = !isNaN(numericScore) ? numericScore.toFixed(1) : score;

  return (
    <Chip
      label={`${label}: ${displayScore}`}
      sx={{
        backgroundColor: getColor(score),
        color: "white",
        fontWeight: "bold",
        mr: 1,
        mb: 1,
      }}
    />
  );
};

export default ScoreChip;
