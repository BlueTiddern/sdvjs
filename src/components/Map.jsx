import "../index.css";
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import usMapData from '../data/us.json';
import { evPop } from '../data/ev_population';

const GeoMap = () => {
    const svgRef = useRef();

    // Define width and height outside of useEffect to use in both useEffect and the returned JSX
    const width = 1000;
    const height = 700;

    // Map FIPS codes to color and aggregate electric range
    const fipsToData = evPop.reduce((acc, cur) => {
        const fips = cur["FIPS Code"].toString().padStart(5, '0');
        if (!acc[fips]) {
            acc[fips] = { color: cur["Assigned Color"] || 'grey', electricRange: 0 };
        }
        acc[fips].electricRange += cur["Electric Range"];
        return acc;
    }, {});

    // Convert TopoJSON to GeoJSON
    const countiesGeoJson = feature(usMapData, usMapData.objects.counties);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const projection = d3.geoAlbersUsa()
            .scale(1000)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', event => {
                svg.selectAll('g').attr('transform', event.transform);
            });

        svg.selectAll("*").remove();

        // Create a tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background', 'white')
            .style('border', 'solid 1px black')
            .style('border-radius', '5px')
            .style('padding', '10px');

        const g = svg.append('g');

        g.selectAll('path')
            .data(countiesGeoJson.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', d => {
                const fips = d.id.toString().padStart(5, '0');
                return fipsToData[fips] ? fipsToData[fips].color : 'grey';  // Use color from fipsToData
            })
            .attr('stroke', 'white')
            .on('mouseover', function (event, d) {
                const fips = d.id.toString().padStart(5, '0');
                tooltip.html(`Electric Range: ${fipsToData[fips]?.electricRange || 0}`)
                    .style('visibility', 'visible');
            })
            .on('mousemove', event => {
                tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', () => {
                tooltip.style('visibility', 'hidden');
            });

        svg.call(zoom);

        createLegend(svg, fipsToData);  // Updated to not pass width
    }, [countiesGeoJson]);

    const createLegend = (svg, fipsToData) => {
        const legendData = Object.entries(fipsToData).map(([fips, data]) => ({
            color: data.color,
            name: evPop.find(c => c["FIPS Code"].toString().padStart(5, '0') === fips)?.County || 'Unknown'
        }));

        // Shift the legend to the right
        const legend = svg.append('g')
            .attr('transform', `translate(${width - 150}, 20)`);  // Adjust the horizontal position of the legend

        legend.selectAll('rect')
            .data(legendData)
            .enter()
            .append('rect')
            .attr('width', 20)
            .attr('height', 20)
            .attr('y', (d, i) => i * 25)
            .attr('fill', d => d.color);

        legend.selectAll('text')
            .data(legendData)
            .enter()
            .append('text')
            .attr('x', 30)
            .attr('y', (d, i) => i * 25 + 15)
            .style('fill', 'white')
            .text(d => d.name);
    };

    return (
        <div style={tooltipStyle}>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
};

export default GeoMap;

// Define your tooltip style object outside of the component
const tooltipStyle = {
    position: 'relative',
    height: '700px', // or use '100%' if the container should be full height
};

// Remember to include styles for .tooltip in your CSS


