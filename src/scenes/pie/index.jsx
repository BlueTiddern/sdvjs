import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChartComponent from "../../components/DonutChartComponent"; // Corrected to use the actual component name

const PieChartPage = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart for EV stock" subtitle="slices transform into region distribution" />
      <Box height="75vh">
        <PieChartComponent /> {/* Correctly referencing the PieChart component */}
      </Box>
    </Box>
  );
};

export default PieChartPage;