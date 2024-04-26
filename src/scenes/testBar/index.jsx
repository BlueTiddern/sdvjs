import { Box } from "@mui/material";
import Header from "../../components/Header";
import TestBar from "../../components/TestBar";

const TestBarPage = () => {
  return (
    <Box m="20px">
      <Header title="D3 Bar Chart" subtitle="Bar chart implemented with D3 for detailed customization" />
      <Box height="75vh">
        <TestBar />
      </Box>
    </Box>
  );
};

export default TestBarPage;
