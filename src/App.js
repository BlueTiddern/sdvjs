import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Bar from "./scenes/bar";
import TestBar from "./scenes/testBar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import PieChartComponent from "./scenes/pie";
import LineChartComponent from "./scenes/line";
import ParallelCoordinates from "./scenes/parallel"
import GeoMap from "./scenes/map";
import TreeChartComponent from "./scenes/tree";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<PieChartComponent /> }/>
              <Route path="/line" element={<LineChartComponent /> }/>
              <Route path="/parallel" element={<ParallelCoordinates /> }/>
              <Route path="/map" element={<GeoMap /> }/>
              <Route path="/tree" element={<TreeChartComponent /> }/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
