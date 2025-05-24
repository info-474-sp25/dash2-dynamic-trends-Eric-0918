// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svg1_RENAME = d3.select("#lineChart1") // If you change this ID, you must change it in index.html too
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const svg2_RENAME = d3.select("#lineChart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// (If applicable) Tooltip element for interactivity
// const tooltip = ...

// 2.a: LOAD...
d3.csv("Dynamic Trend.csv").then(data => {
    // 2.b: ... AND TRANSFORM DATA
    data.forEach(d => {
        d.date = d3.timeParse("%m/%d/%Y")(d.date); 
        d.actual = +d["SUM of actual_mean_temp"];
        d.min = +d["SUM of average_min_temp"];
        d.max = +d["SUM of average_max_temp"];
    });
    // 3.a: SET SCALES FOR CHART 1
const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date)) 
    .range([0, width]); 

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.actual, d.min, d.max))]) 
    .range([height, 0]); 


    // 4.a: PLOT DATA FOR CHART 1

const lineActual = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.actual));

const lineMin = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.min));

const lineMax = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.max));


svg1_RENAME.append("path")
    .datum(data)
    .attr("fill", "none") 
    .attr("stroke", "steelblue") 
    .attr("stroke-width", 2)
    .attr("d", lineActual); 


svg1_RENAME.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 2)
    .attr("d", lineMin);

svg1_RENAME.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", lineMax);


    // 5.a: ADD AXES FOR CHART 1
svg1_RENAME.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale)); 

svg1_RENAME.append("g")
    .call(d3.axisLeft(yScale)); 


    // 6.a: ADD LABELS FOR CHART 1
svg1_RENAME.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Date");

svg1_RENAME.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Precipitation");



// Add legend 
const legendData = [
    { label: "SUM of actual_mean_temp", color: "steelblue" },
    { label: "SUM of average_min_temp", color: "green" },
    { label: "SUM of average_max_temp", color: "red" }
];

legendData.forEach((d, i) => {
    svg1_RENAME.append("circle")
        .attr("cx", width - 150)
        .attr("cy", i * 20+220)
        .attr("r", 6)
        .style("fill", d.color);

    svg1_RENAME.append("text")
        .attr("x", width - 140)
        .attr("y", i * 20 + 220)
        .text(d.label)
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");
});

    // 7.a: ADD INTERACTIVITY FOR CHART 1
    

    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================

    // 3.b: SET SCALES FOR CHART 2


    // 4.b: PLOT DATA FOR CHART 2


    // 5.b: ADD AXES FOR CHART 


    // 6.b: ADD LABELS FOR CHART 2


    // 7.b: ADD INTERACTIVITY FOR CHART 2


});