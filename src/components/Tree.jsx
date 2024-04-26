import React, { useEffect, useState, useRef } from 'react';
import Tree from 'react-d3-tree';
import { carBarData } from "../data/carData";
import * as d3 from 'd3';
import { scaleOrdinal } from 'd3-scale';
import { schemeSet3 } from 'd3-scale-chromatic';




// Define a color scale using D3
const colorScale = scaleOrdinal(schemeSet3);

const transformDataForTree = (data) => {
    const filteredData = data.filter(d =>
        (d.parameter === "EV stock" || d.parameter === "EV sales") &&
        d.year === 2022 &&
        (d.region === "Australia" || d.region === "Germany" || d.region === "India" || d.region === "China") &&
        (d.mode === "Cars" || d.mode === "Buses")
    );

    function nest(data, keys) {
        if (!keys.length) return data.map(d => ({ name: d.parameter || 'No Parameter', attributes: d }));
        const first = keys[0];
        const rest = keys.slice(1);
        return Array.from(d3.group(data, d => d[first]), ([key, values]) => ({
            name: key,
            children: nest(values, rest)
        }));
    }

    return {
        name: 'EV Distribution Tree',
        children: nest(filteredData, ['region', 'parameter', 'mode'])
    };
};

const CustomNodeComponent = ({ nodeDatum, toggleNode, depth }) => {
    const [hover, setHover] = useState(false);
    const isLeaf = !nodeDatum.children || nodeDatum.children.length === 0;
    const isRoot = depth === 0; // Determine if the current node is the root

    // Use the color scale to determine the color based on the depth of the node
    const fillColor = colorScale(depth);

    return (
        <g>
            {isLeaf ? (
                <circle
                    r={10}
                    fill={'#7DF9FF'}
                    onMouseEnter={() => !isRoot && setHover(true)} // Disable hover for root node
                    onMouseLeave={() => setHover(false)}
                    onClick={toggleNode}
                />
            ) : (
                <rect
                    width={120}
                    height={60}
                    x={-60}
                    y={-30}
                    fill={ '#8F00FF'}
                    onMouseEnter={() => !isRoot && setHover(true)} // Disable hover for root node
                    onMouseLeave={() => setHover(false)}
                    onClick={toggleNode}
                />
            )}
            <text
                x={isLeaf ? 20 : 0}
                y={isLeaf ? 20 : 0}
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{
                    fontSize: '12px', 
                    fontFamily: 'Arial', 
                    visibile: (!isRoot && hover) ? 'visible' : 'hidden' // Make text visible on hover, except for root
                }}
            >
                {isLeaf ? `${nodeDatum.name}: ${nodeDatum.attributes.value} ${nodeDatum.attributes.unit}` : nodeDatum.name}
            </text>
        </g>
    );
};


const TreeChartComponent = () => {
    const [data, setData] = useState(null);
    const treeContainerRef = useRef(null);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(0.8); // Initial scale setting, adjust as needed

    useEffect(() => {
        setData(transformDataForTree(carBarData));
    }, []);

    useEffect(() => {
        if (treeContainerRef.current && data) {
            const { width, height } = treeContainerRef.current.getBoundingClientRect();
            setTranslate({ x: width / 2, y: height / 2 });
        }
    }, [treeContainerRef, data]);

    return (
        <div style={{ width: '100%', height: '800px' }} ref={treeContainerRef}>
            {data && (
                <Tree
                    data={data}
                    translate={translate}
                    scale={scale}
                    orientation="vertical"
                    pathFunc="diagonal"
                    renderCustomNodeElement={({ nodeDatum, toggleNode, depth }) =>
                        <CustomNodeComponent nodeDatum={nodeDatum} toggleNode={toggleNode} depth={depth} />
                    }
                    nodeSize={{ x: 90, y: 400 }}
                    separation={{ siblings: 1.7, nonSiblings: 2 }}
                />
            )}
        </div>
    );
};

export default TreeChartComponent;

