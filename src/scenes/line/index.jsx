import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChartComponent from "../../components/LineChart"; // Corrected to use the actual component name

const LineChartPage = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart for EV Stock by year and region" subtitle="Each color represents a region" />
      <Box height="70vh">
        <LineChartComponent /> {/* Correctly referencing the PieChart component */}
      </Box>
    </Box>
  );
};
export default LineChartPage;