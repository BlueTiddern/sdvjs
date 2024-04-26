import { Box } from "@mui/material";
import Header from "../../components/Header";
import ParallelCoordinates from "../../components/Parallel";

const ParallelPage = () => {
  return (
    <Box m="20px">
      <Header title="Parallel cordinates car stats - with vloume weight and carbon emission index" />
      <Box height="75vh">
        <ParallelCoordinates />
      </Box>
    </Box>
  );
};

export default ParallelPage;
