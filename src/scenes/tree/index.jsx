import { Box } from "@mui/material";
import Header from "../../components/Header";
import Tree from "../../components/Tree";

const TreePage = () => {
  return (
    <Box m="20px">
      <Header title="Tree for EV distribution" subtitle="India, China, Australia and Gernamy Distribution" />
      <Box height="75vh">
        <Tree />
      </Box>
    </Box>
  );
};

export default TreePage;
