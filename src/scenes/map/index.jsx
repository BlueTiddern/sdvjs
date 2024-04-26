import { Box } from "@mui/material";
import Header from "../../components/Header";
import GeoMap from "../../components/Map"; // Corrected to use the actual component name

const GeoChartPage = () => {
  return (
    <Box m="20px">
      <Header title="US Map" subtitle="WA Counties color coded with aggregate ranges for each over years" />
      <Box height="80vh">
        <GeoMap /> {/* Correctly referencing the PieChart component */}
      </Box>
    </Box>
  );
};
export default GeoChartPage;