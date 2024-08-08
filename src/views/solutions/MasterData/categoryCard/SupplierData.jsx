import React, { useState, useRef, useEffect } from "react";
import { AppBar, Tabs, Tab, Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import PolicyIcon from "@mui/icons-material/Policy";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SavingsIcon from "@mui/icons-material/Savings";
import WarningIcon from "@mui/icons-material/Warning";
import InsightsIcon from "@mui/icons-material/Insights";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SupplierInformation from "./Tabs/SupplierInformation/SupplierInformation";
import SpendPattern from "./Tabs/SpendPattern";
import CostSavingOppertunity from "./Tabs/CostSavingOppertunity";
import Policy from "./Tabs/Policy";
import ProcessAndDocument from "./Tabs/ProcessAndDocuments";
import ApprovalPage from "./Tabs/Approvals";
import RiskAnalysis from "./Tabs/RiskAnalysis";
import DynamicForm from "./Tabs/DynamicForm";

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: "#5e17eb",
  "&.Mui-selected": {
    color: "#5e17eb",
  },
  "& .MuiSvgIcon-root": {
    marginBottom: "0px !important",
    marginRight: theme.spacing(1),
  },
}));

const StyledIconButton = styled(IconButton)(({ theme, disabled }) => ({
  color: disabled ? theme.palette.action.disabled : "#6b6be2",
  "&:hover": {
    backgroundColor: "rgba(107, 107, 226, 0.04)",
  },
}));

const ScrollContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "100%",
  overflowX: "hidden",
});

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: "white",
  "& .MuiTabs-indicator": {
    backgroundColor: "#6b6be2",
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "none",
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function SupplierData({
  categoryCardId,
  spendPatternData,
  supplierId,
  categoryName,
}) {
  const [value, setValue] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const tabsRef = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const scrollTabs = (scrollOffset) => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft += scrollOffset;
      checkScroll();
    }
  };

  const checkScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  return (
    <div>
      <StyledAppBar position="static">
        <Box display="flex" alignItems="center">
          <StyledIconButton
            onClick={() => scrollTabs(-100)}
            disabled={!showLeftArrow}
          >
            <ChevronLeftIcon />
          </StyledIconButton>
          <ScrollContainer>
            <StyledTabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
              aria-label="scrollable auto tabs example"
              ref={tabsRef}
              onScroll={checkScroll}
              sx={{ flexGrow: 1 }}
            >
              <StyledTab
                icon={<InfoIcon />}
                label="Supplier Information"
                {...a11yProps(0)}
              />
              <StyledTab
                icon={<DescriptionIcon />}
                label="Process and Documents"
                {...a11yProps(1)}
              />
              <StyledTab
                icon={<PolicyIcon />}
                label="Policies"
                {...a11yProps(2)}
              />
              <StyledTab
                icon={<ThumbUpIcon />}
                label="Approval"
                {...a11yProps(3)}
              />
              <StyledTab
                icon={<TrendingUpIcon />}
                label="Spend Patterns"
                {...a11yProps(4)}
              />
              <StyledTab
                icon={<SavingsIcon />}
                label="Cost Saving Opportunity"
                {...a11yProps(5)}
              />
              <StyledTab
                icon={<WarningIcon />}
                label="Risk Analysis"
                {...a11yProps(6)}
              />
              <StyledTab
                icon={<InsightsIcon />}
                label="Market Intelligence & Prediction"
                {...a11yProps(7)}
              />
            </StyledTabs>
          </ScrollContainer>
          <StyledIconButton
            onClick={() => scrollTabs(100)}
            disabled={!showRightArrow}
          >
            <ChevronRightIcon />
          </StyledIconButton>
        </Box>
      </StyledAppBar>
      <TabPanel value={value} index={0}>
        <SupplierInformation
          categoryCardId={categoryCardId}
          supplierId={supplierId}
          categoryName={categoryName}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProcessAndDocument categoryCardId={categoryCardId} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Policy categoryCardId={categoryCardId} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ApprovalPage categoryCardId={categoryCardId} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <SpendPattern spendPatternData={spendPatternData} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <CostSavingOppertunity categoryCardId={categoryCardId} />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <RiskAnalysis categoryCardId={categoryCardId} />
      </TabPanel>
      <TabPanel value={value} index={7}></TabPanel>
    </div>
  );
}