import React from "react";
import { Chip } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

const RecommendedBadge = () => (
  <Chip
    icon={<VerifiedIcon />}
    label="Recommended"
    size="small"
    sx={{
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "#6b6be2",
      fontWeight: "bold",
      "& .MuiChip-icon": {
        color: "#6b6be2",
      },
    }}
  />
);

export default RecommendedBadge;
