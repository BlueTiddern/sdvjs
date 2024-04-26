import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { carBarData } from "../data/carData";

// Transforming the data to match the requirements for the Nivo bar chart
const transformData = (data) => {
  // Filtering out data for the "EV sales" parameter and the "Cars" mode, up to the year 2022
  const filteredData = data.filter(d => d.parameter === "EV sales" && d.mode === "Cars" && d.year > 2010 && d.year <= 2022);

  // Grouping the data by year and accumulating BEV and PHEV values
  const groupedData = filteredData.reduce((acc, curr) => {
    const { year, powertrain, value } = curr;
    const yearEntry = acc[year] || { year };
    yearEntry[powertrain] = value;
    acc[year] = yearEntry;
    return acc;
  }, {});

  // Sorting the data by year to ensure correct order on the X-axis
  const sortedData = Object.values(groupedData).sort((a, b) => a.year - b.year);
  return sortedData;
};

// The BarChart component that will render the bar chart based on the data provided
const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const transformedData = transformData(carBarData);

  return (
    <ResponsiveBar
      data={transformedData}
      keys={["BEV", "PHEV"]}
      indexBy="year"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Year",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "EV Sales",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      tooltip={({ id, value, indexValue }) => `${id}: ${value} in year: ${indexValue}`} // Enabling tooltip to show values on hover
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default BarChart;
