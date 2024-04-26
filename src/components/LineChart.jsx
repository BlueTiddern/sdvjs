import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { carBarData } from "../data/carData"; // Your data import
import custColor from "../color"; // Color import

const LineChart = () => {
  const svgRef = useRef();
  const margin = { top: 5, right: 70, bottom: 130, left: 100 };
  const width = 900;
  const height = 510;

  // Ensure every year has an entry for each region
  const processData = (data) => {
    const parameter = 'EV stock';
    const years = d3.extent(data, d => d.year); // Get the extent of years in the data
    const endYear = Math.min(years[1], 2022);  // Ensure data only goes up to 2022
    const regions = Array.from(new Set(data.map(d => d.region))); // Unique regions
    const fullData = [];

    for (let year = years[0]; year <= endYear; year++) {  // Iterate only until 2022
        regions.forEach(region => {
            const existingEntry = data.find(d => d.year === year && d.region === region && d.parameter === parameter);
            if (existingEntry) {
                fullData.push({...existingEntry, year: new Date(year, 0, 1)});
            } else {
                // If no data for this region and year, push a default value (e.g., value: 0)
                fullData.push({year: new Date(year, 0, 1), region: region, value: 0, parameter: parameter});
            }
        });
    }
    return fullData;
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = processData(carBarData);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.year))
      .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([height - margin.top - margin.bottom, 0]);

    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.region))
      .range(custColor);

     // Tooltip setup
     const tooltip = d3.select("body").append("div")
     .attr("class", "tooltip")
     .style("position", "absolute")
     .style("visibility", "hidden")
     .style("background", "#fff")
     .style("border", "1px solid #d1d1d1")
     .style("padding", "8px")
     .style("border-radius", "4px")
     .style("pointer-events", "none");  

    // Gridlines
    const xGridlines = d3.axisBottom(xScale)
      .tickSize(-height + margin.top + margin.bottom)
      .tickFormat('');
    const yGridlines = d3.axisLeft(yScale)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat('');

    // Add gridlines
    svg.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
    .call(xGridlines)
    .selectAll("line")
    .style("stroke", "#ffffff") // Light grey color for subtle appearance
    .style("stroke-opacity", "0.2"); // Lower opacity for subtlety

  svg.append('g')
    .attr('class', 'grid')
    .call(yGridlines)
    .selectAll("line")
    .style("stroke", "#ffffff")
    .style("stroke-opacity", "0.2");

    // X-axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(xAxis);

    // Y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append("g").call(yAxis);

    // Legend
    const legendSpacing = 9; // Decrease the space between legend items
    const legendRectSize = 6; // Smaller size for the legend color boxes
    const legendTextSize = "7px"; // Smaller font-size for the legend text
    const legend = svg.selectAll(".legend")
      .data(colorScale.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(${width - margin.right - 40}, ${margin.top + i * legendSpacing})`);

    legend.append("rect")
      .attr("x", 0)
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .style("fill", colorScale);

    legend.append("text")
      .attr("x", -5)
      .attr("y", legendRectSize / 2)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size", legendTextSize)
      .attr("fill", "white")
      .text(d => d);

    // Line Generator
    const lineGenerator = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const nestedData = d3.groups(data, d => d.region);

    nestedData.forEach(([region, values]) => {
      const path = svg.append("path")
        .datum(values)
        .attr("class", `line line-${region}`)
        .attr("fill", "none")
        .attr("stroke", colorScale(region))
        .attr("stroke-width", 1.5)
        .attr("d", lineGenerator);

      // Calculate the length of each line path
      const totalLength = path.node().getTotalLength();

      // Set up the starting positions
      path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        // Transition to draw the line
        .transition()
        .duration(2000) // Animation duration in milliseconds
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    });

    // Axis labels
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", (width - margin.left - margin.right) / 2)
      .attr("y", height - margin.bottom + 40)
      .attr("fill", "white")
      .text("Year");

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -(height - margin.top - margin.bottom) / 2)
      .attr("fill", "white")
      .text("EV Stock");
  }, []);

  return <svg ref={svgRef} />;
};

export default LineChart;
