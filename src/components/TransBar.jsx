import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { carBarData } from "../data/carData";
import * as d3 from 'd3';

const TransBarComponent = ({ year, onBack }) => { // Ensure onBack is received as a prop
    const [barData, setBarData] = useState({
        x: [],
        y: [],
        type: 'bar',
    });

    useEffect(() => {
        // Filter data for the selected year
        const yearData = carBarData.filter(d => d.year === year && d.region !== 'World');

        // Aggregate data by region
        const aggregatedData = d3.rollups(yearData, 
            (v) => d3.sum(v, leaf => leaf.value), // sum up all values for each region
            d => d.region // group by region
        );

        // Prepare the data for Plotly
        const plotData = {
            x: aggregatedData.map(d => d[0]), // regions
            y: aggregatedData.map(d => d[1]), // aggregated values
            type: 'bar',
        };

        setBarData(plotData);
    }, [year]); // Ensures that this effect runs when 'year' changes

    return (
        <>
            <button onClick={onBack} style={{ padding: '10px', marginBottom: '10px' }}>Back to Pie Chart</button>
            <Plot
                data={[barData]} // Fixed: directly use barData which already contains x, y, and type
                layout={{
                    width: 900,
                    height: 700,
                    title: `EV Stock by Region for ${year}`,
                    xaxis: {
                        title: 'Region',
                    },
                    yaxis: {
                        title: 'EV Stock Value',
                        automargin: true, // Ensures that labels are not cut off
                    },
                    margin: { t: 40 } // Optional: adjust top margin to ensure title visibility
                }}
            />
        </>
    );
};

export default TransBarComponent;
