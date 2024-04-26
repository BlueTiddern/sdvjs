import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { carbonData } from "../data/coData";
import colors from "../color"; // This is your color array
import "../index.css"; // Make sure this path is correct

const ParallelCoordinates = () => {
    const ref = useRef(null);
    const theme = useTheme();
    const themeColors = tokens(theme.palette.mode);

    useEffect(() => {
        if (!ref.current) return;

        const dimensions = ["Model", "Volume_lts", "Weight_kgs", "CO2"];
        const margin = { top: 30, right: 160, bottom: 50, left: 60 };
        const width = 1000 - margin.left - margin.right;
        const height = 700 - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const yScales = dimensions.reduce((acc, dimension) => {
            acc[dimension] = dimension === 'Model' ?
                d3.scalePoint().domain(carbonData.map(d => d[dimension])).range([height, 0]).padding(1) :
                d3.scaleLinear().domain(d3.extent(carbonData, d => d[dimension])).range([height, 0]);
            return acc;
        }, {});

        const xScale = d3.scalePoint()
            .domain(dimensions)
            .range([0, width]);

        const colorScale = d3.scaleOrdinal()
            .domain(carbonData.map(d => d.Model))
            .range(colors);

        const lineGenerator = d3.line()
            .x(d => xScale(d.dimension))
            .y(d => yScales[d.dimension](d.value));

        // Apply initial drawing animation
        svg.selectAll("path")
            .data(carbonData)
            .enter()
            .append("path")
            .attr("class", d => `line line-${String(d.Model).replace(/\s+/g, '-')}`)
            .attr("d", d => lineGenerator(dimensions.map(p => ({ dimension: p, value: d[p] }))))
            .attr("fill", "none")
            .attr("stroke", d => colorScale(d.Model))
            .attr("stroke-width", "2.1")
            .attr("stroke-dasharray", function() {
                const totalLength = this.getTotalLength();
                return `${totalLength} ${totalLength}`;
            })
            .attr("stroke-dashoffset", function() {
                return this.getTotalLength();
            })
            .transition()
            .duration(2000)
            .attr("stroke-dashoffset", 0)
            .attr("opacity", 1);

        svg.selectAll("path")
            .append("title")
            .text(d => `Model: ${d.Model}\nVolume: ${d.Volume_lts} l\nWeight: ${d.Weight_kgs} kg\nCO2: ${d.CO2}`);

        dimensions.forEach(function(dimension) {
            svg.append("g")
                .attr("transform", `translate(${xScale(dimension)},0)`)
                .call(d3.axisLeft(yScales[dimension]))
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(dimension)
                .style("fill", themeColors.textColor || 'white');
        });

        const legend = svg.selectAll(".legend")
            .data(colorScale.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width + margin.left - 10}, ${i * 20 - 50})`); // Move legend up by adjusting the y-offset

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", colorScale)
            .classed("legend-rect", true)
            .on("click", function(_, model) {
                // Toggle visibility based on background matching
                const isActive = d3.select(this).classed("active");
                svg.selectAll(".line")
                    .attr("stroke", "#fff"); // Set all lines to background color
                svg.selectAll(`.line-${String(model).replace(/\s+/g, '-')}`)
                    .attr("stroke", isActive ? "#fff" : colorScale(model)); // Toggle the stroke color

                d3.selectAll(".legend rect")
                    .classed("active", false);
                d3.select(this)
                    .classed("active", !isActive);
            });

        legend.append("text")
            .attr("x", 20)
            .attr("y", 7.5)
            .attr("dy", ".35em")
            .style("fill", 'white')
            .text(d => d);
    }, [themeColors, carbonData]);

    return <svg ref={ref} />;
};

export default ParallelCoordinates;
