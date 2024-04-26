import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { carBarData } from "../data/carData";
import custColor from "../color";
import TransBarComponent from '../components/TransBar';

const transformData = (data) => {
    const aggregatedData = data.reduce((acc, curr) => {
        if (curr.parameter === 'EV stock' && curr.year > 2010 && curr.year <= 2022) {
            const { year, value } = curr;
            if (!acc[year]) {
                acc[year] = { year, value: 0 };
            }
            acc[year].value += value;
        }
        return acc;
    }, {});
    return Object.values(aggregatedData).sort((a, b) => a.year - b.year);
};

const DonutChartComponent = ({ isDashboard = false }) => {
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    const [data, setData] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [showBarChart, setShowBarChart] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);

    const handleBack = () => {
        setShowBarChart(false); // This function will be passed to TransBarComponent
    };

    useEffect(() => {
        const transformedData = transformData(carBarData);
        setData(transformedData);
    }, []);

    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;
        
        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.year))
            .range(custColor);

        const width = 750;
        const height = 500;
        const radius = Math.min(width, height) / 2;
        const donutHoleRadius = radius / 2;

        

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style('user-select', 'none');

        const group = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie().value(d => d.value);
        const arc = d3.arc().innerRadius(donutHoleRadius).outerRadius(radius);

        const arcs = group.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('fill', d => colorScale(d.data.year))
            .attr('stroke', 'black')
            .style('stroke-width', '0.1px')
            .attr('d', arc)
            .on('mouseover', function(event, d) {
                tooltip.style("opacity", 1)
                    .html(`Year: ${d.data.year}<br>Value: ${d.data.value}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on('mouseout', function() {
                tooltip.style("opacity", 0);
            })
            .on('click', (event, d) => {
                if (!isDashboard) {
                    setSelectedYear(d.data.year);
                    setShowBarChart(true);
                }
            });

        arcs.transition()
            .duration(750)
            .attrTween('d', function (d) {
                const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function (t) {
                    return arc(interpolate(t));
                };
            });

        const tooltip = d3.select(tooltipRef.current)
            .style("opacity", 0)
            .style("position", "absolute")
            .style("text-align", "center")
            .style("width", "120px")
            .style("padding", "5px")
            .style("background", "grey")
            .style("border", "1px solid #000")
            .style("border-radius", "5px")
            .style("pointer-events", "none");

        if (!isDashboard) {
            const legendWidth = 90;
            const legendItemHeight = 20;
            const legendItemGap = 5;
            const legendGroup = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(${width - legendWidth}, 0)`);

            legendGroup.selectAll(null)
                .data(pie(data))
                .enter()
                .append('g')
                .attr('class', 'legend-item')
                .attr('transform', (d, i) => `translate(0, ${i * (legendItemHeight + legendItemGap)})`)
                .each(function(d) {
                    const g = d3.select(this);
                    g.append('rect')
                        .attr('width', legendItemHeight)
                        .attr('height', legendItemHeight)
                        .attr('fill', colorScale(d.data.year));
                    g.append('text')
                        .attr('x', legendItemHeight + legendItemGap)
                        .attr('y', legendItemHeight / 2)
                        .attr('dy', '0.35em')
                        .text(d.data.year)
                        .attr('fill', colors.textColor || 'white')
                        .style('font-size', '12px')
                        .style('user-select', 'none');
                });
        }

        group.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('font-size', '20px')
            .style('fill', 'white')
            .text('EV STOCK');
    }, [data, colors, isDashboard]);

    if (!isDashboard && showBarChart) {
        return <TransBarComponent year={selectedYear} onBack={handleBack} />;
    }

    return (
        <>
            <svg ref={svgRef} />
            <div ref={tooltipRef} />
        </>
    );
};

export default DonutChartComponent;
