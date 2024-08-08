import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Tabs,
  Tab,
  Grid,
  Container
} from "@mui/material";
import { LineChart, BarChart  } from "@mui/x-charts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CompareIcon from "@mui/icons-material/Compare";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";

const SpendPattern = ({ spendPatternData }) => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  console.log("Spend pattern",spendPatternData);
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const years = [
    ...new Set([
      ...spendPatternData.target_spend.map((item) => item.period),
      ...spendPatternData.actual_spend.map((item) => item.period),
      ...spendPatternData.projected_spend.map((item) => item.period),
      ...spendPatternData.compliance_spend.map((item) => item.period),
      ...spendPatternData.tail_spend.map((item) => item.period),
    ]),
  ].sort();

  const chartColors = {
    primary: "#6b6be2",
    secondary: theme.palette.secondary.main,
    tertiary: theme.palette.error.main,
  };

  const commonChartProps = {
    margin: { top: 40, right: 40, bottom: 80, left: 80 },
    sx: {
      "& .MuiChartsAxis-line": {
        stroke: theme.palette.text.secondary,
      },
      "& .MuiChartsAxis-tick": {
        stroke: theme.palette.text.secondary,
      },
      "& .MuiChartsAxis-label": {
        fill: theme.palette.text.primary,
        fontWeight: "bold",
      },
      "& .MuiChartsLegend-root": {
        marginTop: "16px",
      },
    },
  };

  const renderChart = (index) => {
    switch (index) {
      case 0: {
        const targetData = years.map((year) => {
          const item = spendPatternData.target_spend.find(
            (i) => i.period === year
          );
          return item ? parseFloat(item.spend) : null;
        });
        const actualData = years.map((year) => {
          const item = spendPatternData.actual_spend.find(
            (i) => i.period === year
          );
          return item ? parseFloat(item.spend) : null;
        });
        const projectedData = years.map((year) => {
          const item = spendPatternData.projected_spend.find(
            (i) => i.period === year
          );
          return item ? parseFloat(item.spend) : null;
        });

        const series = [
          targetData.some((item) => item !== null) && {
            data: targetData,
            label: "Target Spend",
            color: chartColors.primary,
            curve: "monotoneX",
          },
          actualData.some((item) => item !== null) && {
            data: actualData,
            label: "Actual Spend",
            color: chartColors.secondary,
            curve: "monotoneX",
          },
          projectedData.some((item) => item !== null) && {
            data: projectedData,
            label: "Projected Spend",
            color: chartColors.tertiary,
            curve: "monotoneX",
          },
        ].filter(Boolean); // Remove falsy values (e.g., false)

        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LineChart
                xAxis={[
                  {
                    data: years,
                    label: "Year",
                    scaleType: "band",
                    tickLabelStyle: {
                      angle: 45,
                      textAnchor: "start",
                      fontSize: 12,
                    },
                  },
                ]}
                series={series}
                width={1000}
                height={400}
                {...commonChartProps}
              />
            </Grid>
          </Grid>
        );
      }
      case 1: {
        const complianceData = years.map((year) => {
          const item = spendPatternData.compliance_spend.find(
            (i) => i.period === year
          );
          return item ? parseFloat(item.spend) : 0;
        });
  
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <BarChart
                xAxis={[
                  {
                    data: years,
                    label: "Year",
                    scaleType: "band",
                    tickLabelStyle: {
                      angle: 45,
                      textAnchor: "start",
                      fontSize: 12,
                    },
                  },
                ]}
                series={[
                  {
                    data: complianceData,
                    label: "Compliance Spend",
                    color: chartColors.primary,
                  },
                ]}
                width={1000}
                height={400}
                {...commonChartProps}
              />
            </Grid>
          </Grid>
        );
      }
      case 2: {
        const tailSpendData = years.map((year) => {
          const item = spendPatternData.tail_spend.find(
            (i) => i.period === year
          );
          return item ? parseFloat(item.spend) : 0;
        });
  
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <BarChart
                xAxis={[
                  {
                    data: years,
                    label: "Year",
                    scaleType: "band",
                    tickLabelStyle: {
                      angle: 45,
                      textAnchor: "start",
                      fontSize: 12,
                    },
                  },
                ]}
                series={[
                  {
                    data: tailSpendData,
                    label: "Tail Spend",
                    color: chartColors.secondary,
                  },
                ]}
                width={1000}
                height={400}
                {...commonChartProps}
              />
            </Grid>
          </Grid>
        );
      }
      default:
        return null;
    }
  };
  
  return (
    <Container maxWidth="2xl" sx={{ mt: 0 }}>
      <Paper>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            mb: 3,
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": { color: "#5e17eb" },
            "& .Mui-active": { color: "#5e17eb", fontWeight: "bold" },
            "& .MuiTabs-indicator": { backgroundColor: "#5e17eb" },
          }}
        >
          <Tab
            icon={<TrendingUpIcon />}
            label="Target vs Actual vs Projected"
          />
          <Tab icon={<CompareIcon />} label="Compliance Spend" />
          <Tab icon={<StackedLineChartIcon />} label="Tail Spend" />
        </Tabs>
        <Box sx={{ mt: 3 }}>{renderChart(currentTab)}</Box>
      </Paper>
    </Container>
  );
};

export default SpendPattern;
