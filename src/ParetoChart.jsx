import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const generateParetoData = (alpha, scale = 1, size = 1000) => {
    return Array.from({ length: size }, () => scale * (1 - Math.random()) ** (-1 / alpha));
};

const generateCauchyData = (x0, gamma, size = 1000) => {
    return Array.from({ length: size }, () => x0 + gamma * Math.tan(Math.PI * (Math.random() - 0.5)));
};

const DistributionChart = ({ distributionType, alpha, scale, size, x0, gamma }) => {
    const d3Container = useRef(null);

    useEffect(() => {
        if (d3Container.current) {
            let data;
            switch (distributionType) {
                case 'pareto':
                    data = generateParetoData(alpha, scale, size);
                    break;
                case 'cauchy':
                    data = generateCauchyData(x0, gamma, size);
                    break;
                default:
                    data = [];
            }

            console.log(data.toSorted());

            d3.select(d3Container.current).selectAll("*").remove();

            const margin = { top: 20, right: 30, bottom: 30, left: 40 };
            const width = 460 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3.select(d3Container.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([0, width]);

            const xAxis = svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .attr("class", "x-axis");

            const histogram = d3.histogram()
                .value(d => d)
                .domain(x.domain())
                .thresholds(x.ticks(70)); // Set initial number of bins

            let bins = histogram(data);

            const y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(bins, d => d.length)]);
            svg.append("g")
                .call(d3.axisLeft(y));

            svg.selectAll("rect")
                .data(bins)
                .join("rect")
                .attr("x", d => x(d.x0) + 1)
                .attr("transform", d => `translate(0, ${y(d.length)})`)
                .attr("width", d => x(d.x1) - x(d.x0) - 1)
                .attr("height", d => height - y(d.length))
                .style("fill", "#69b3a2");

            const tooltip = d3.select(d3Container.current)
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            svg.selectAll("rect")
                .on("mouseover", function (event, d) {
                    tooltip.transition().duration(200).style("opacity", 1);
                    tooltip.html(`Range: ${d.x0} to ${d.x1}<br/>Count: ${d.length}`)
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function () {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

                const zoom = d3.zoom()
                .scaleExtent([0.5, 10]) // Adjust as needed
                .translateExtent([[0, 0], [width, height]])
                .on("zoom", (event) => {
                    // Update x-axis scale
                    const new_xScale = event.transform.rescaleX(x);
            
                    // Update the x-axis
                    xAxis.call(d3.axisBottom(new_xScale));
            
                    // Update the bars positioning and width
                    svg.selectAll("rect")
                        .attr("x", d => new_xScale(d.x0))
                        .attr("width", d => Math.max(0, new_xScale(d.x1) - new_xScale(d.x0)));
                });
            
            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .call(zoom);
        }
    }, [distributionType, alpha, scale, size, x0, gamma]);
    return (
        <div className="chart-container" ref={d3Container}></div>
    );
};

export default DistributionChart;
