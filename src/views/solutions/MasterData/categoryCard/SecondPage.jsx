import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  TextField,
  Checkbox,
  Tooltip
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IconArrowLeft } from "@tabler/icons-react";
import MainCard from "ui-component/cards/MainCard";
import SubCard from "ui-component/cards/SubCard";
import SupplierData from "./SupplierData";
import { MENU_TOGGLE } from "store/actions";
import { useSelector } from 'react-redux';
import theme from "themes";

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "self-start",
    marginBottom: theme.spacing(2),
  },
  closeButton: {
    color: "#5e17eb",
  },
  chipContainer: {
    display: "flex",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    flexWrap: "wrap",
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
    color: "#5e17eb",
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  iconGroup: {
    display: 'flex',
    justifyContent: "right",
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  statusChip: {
    marginLeft: theme.spacing(1),
    verticalAlign: 'middle',
  },
  backButton: {
    position: 'absolute',
    top: theme.spacing(12),
    color: "#5e17eb",
    zIndex: 1,
    transition: 'left 0.3s',
  },
}));

const SecondPage = ({ category, onClose, handleStatusChange, categoryCardId, categoryName, categoryStates, spendPatternData}) => {
  const classes = useStyles();
  const isMenuOpen = useSelector((state) => state.customization.opened);

  if (!category) return null;
  const mainCardContent = (
    <>
       <Tooltip title="Back" placement="right" arrow>
        <IconButton
          aria-label="back"
          className={classes.backButton}
          onClick={onClose}
          sx={{ left: isMenuOpen ? `${theme.spacing * 34}px` : `${theme.spacing * 28}px` }}
        >
          <IconArrowLeft size={22} />
        </IconButton>
      </Tooltip>

      <Box display="flex" flexDirection="row" gap={2} mb={2} mt={6}>
        <Box flex={1} className={classes.section}>
          <Typography variant="subtitle1" sx={{ color: "#5e17eb", mb: 1, fontSize: "1rem", display: 'flex', alignItems: 'center' }}>
            Category Card Id
            <Chip
              label={categoryStates[category?.category_card_id] ? "Activated" : "Deactivated"}
              color={categoryStates[category?.category_card_id] ? "success" : "default"}
              size="small"
              className={classes.statusChip}
              sx={{ bgcolor: categoryStates[category?.category_card_id] ? '#3CB844' : 'default',  color: categoryStates[category?.category_card_id] ? "white": '#444444' }}
            />
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={category?.category_card_id}
            InputProps={{
              readOnly: true,
              style: {
                height: "40px",
                backgroundColor: "white",
              },
            }}
            sx={{
              backgroundColor: "white !important",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white !important",
                "& input": {
                  backgroundColor: "white !important",
                },
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                  borderWidth: "1px",
                },
              },
            }}
          />
        </Box>

        <Box flex={1} className={classes.section}>
          <Typography variant="subtitle1" sx={{ color: "#5e17eb", mb: 1, fontSize: "1rem" }}>
            Category Owner
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={category.category_owner}
            InputProps={{
              readOnly: true,
              style: {
                height: "40px",
                backgroundColor: "white",
              },
            }}
            sx={{
              backgroundColor: "white !important",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white !important",
                "& input": {
                  backgroundColor: "white !important",
                },
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                  borderWidth: "1px",
                },
              },
            }}
          />
        </Box>
      </Box>
      <Box className={classes.section}>
        <Typography variant="subtitle1" sx={{ color: "#5e17eb", mb: 1, fontSize: "1rem" }}>
          Category Card Description
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={category.category_card_description}
          InputProps={{
            readOnly: true,
            style: {
              height: "40px",
              backgroundColor: "white",
            },
          }}
          sx={{
            backgroundColor: "white !important",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white !important",
              "& input": {
                backgroundColor: "white !important",
              },
              "& fieldset": {
                borderColor: "rgba(0, 0, 0, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(0, 0, 0, 0.23)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "rgba(0, 0, 0, 0.23)",
                borderWidth: "1px",
              },
            },
          }}
        />
      </Box>
      <Box className={classes.chipContainer} >
        <Chip
          label={`Parent Category ID: ${category.parent_category_id}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`Category Level: ${category.category_level}`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          label={`UNSPSC Code: ${category.unspsc_code}`}
          color="info"
          variant="outlined"
        />
        <Chip
          label={`Country: ${category.country}`}
          color="secondary"
          variant="outlined"
        />
      </Box>
      <Divider className={classes.divider} />
      <SupplierData categoryCardId={categoryCardId} categoryName={categoryName} spendPatternData={spendPatternData}/>
    </>
  );

  return (
    <MainCard border={false} title="Category Card Details">
      {mainCardContent}
    </MainCard>
  );
};

export default SecondPage;