import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import TestBar from "../../components/TestBar"; // Make sure the path is correct
import PieChartComponent from "../../components/DonutChartComponent";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="minmax(250px, auto)" // Adjusted to fit content
        gap="20px"
      >
        
        {/* Original BarChart Container */}
        <Box
          gridColumn="span 5"
          bgcolor={colors.primary[500]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600" mb="20px">
            PHEV and BEV trend - 2011 to 2022
          </Typography>
          <Box height="75vh"> {/* Adjust height if necessary */}
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        {/* TestBar (D3) Container */}
        {/* <Box
          gridColumn="span 2"
          bgcolor={colors.primary[500]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600" mb="20px">
            Sales Quantity (D3)
          </Typography>
          <Box height="75vh"> {/* Adjust height if necessary */}
            {/* <TestBar isDashboard={true} /> 
          </Box>
        </Box> */}

       {/* PieChart Container */}
       <Box
          gridColumn="span 2"
          bgcolor={colors.primary[500]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600" mb="20px">
            Market Share buy EV stock: Region specific
          </Typography>
          <Box height="40vh"> 
            <PieChartComponent /> {/* Use your custom D3 pie chart component */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
