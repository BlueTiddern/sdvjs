import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useTheme } from "@mui/material";
import { carBarData } from "../data/carData";
import { tokens } from "../theme";

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

const TestBar = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transformedData] = useState(() => transformData(carBarData));
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear svg content before adding new elements

    const { width, height } = dimensions;
    const margin = { top: 50, right: 130, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scales
    const xScale = d3.scaleBand()
      .domain(transformedData.map(d => d.year))
      .range([0, innerWidth])
      .padding(0.3);
      
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(transformedData, d => d.BEV + d.PHEV)])
      .range([innerHeight, 0]);

    // Axes
    const xAxis = g => g
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0));

    const yAxis = g => g
      .call(d3.axisLeft(yScale));

    // Draw bars
    svg.append('g')
      .selectAll('rect')
      .data(transformedData)
      .join('rect')
      .attr('x', d => xScale(d.year))
      .attr('y', d => yScale(d.BEV + d.PHEV))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.BEV + d.PHEV))
      .attr('fill', colors.chartPrimary);

    // Call axes
    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    // Optional: Add axes labels, titles, and so on here

  }, [colors, dimensions, transformedData]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default TestBar;
