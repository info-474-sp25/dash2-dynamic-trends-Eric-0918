// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Select and append group to existing SVG (fix nested SVG issue)
const svg1_RENAME = d3.select("#lineChart1")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip element
const tooltip = d3.select("#tooltip");

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
    const lineActual = d3.line().x(d => xScale(d.date)).y(d => yScale(d.actual));
    const lineMin = d3.line().x(d => xScale(d.date)).y(d => yScale(d.min));
    const lineMax = d3.line().x(d => xScale(d.date)).y(d => yScale(d.max));

    svg1_RENAME.append("path")
        .datum(data)
        .attr("class", "lineActual")
        .attr("fill", "none") 
        .attr("stroke", "steelblue") 
        .attr("stroke-width", 2)
        .attr("d", lineActual); 

    svg1_RENAME.append("path")
        .datum(data)
        .attr("class", "lineMin")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", lineMin);

    svg1_RENAME.append("path")
        .datum(data)
        .attr("class", "lineMax")
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
        .text("Temperature (°F)");

    // Add legend 
    const legendData = [
        { label: "SUM of actual_mean_temp", color: "steelblue" },
        { label: "SUM of average_min_temp", color: "green" },
        { label: "SUM of average_max_temp", color: "red" }
    ];

    legendData.forEach((d, i) => {
        svg1_RENAME.append("circle")
            .attr("cx", width - 150)
            .attr("cy", i * 20 + 220)
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
    svg1_RENAME.selectAll("circle.tooltip-dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "tooltip-dot")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.actual))
        .attr("r", 4)
        .attr("fill", "steelblue")
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(
                `<strong>Date:</strong> ${d.date.toLocaleDateString()}<br>
                 <strong>Actual:</strong> ${d.actual}°F<br>
                 <strong>Min:</strong> ${d.min}°F<br>
                 <strong>Max:</strong> ${d.max}°F`
            )
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition().duration(300).style("opacity", 0);
        });

    d3.select("#toggleActual").on("change", function () {
        d3.select(".lineActual").style("display", this.checked ? null : "none");
    });
    d3.select("#toggleMin").on("change", function () {
        d3.select(".lineMin").style("display", this.checked ? null : "none");
    });
    d3.select("#toggleMax").on("change", function () {
        d3.select(".lineMax").style("display", this.checked ? null : "none");
    });
});
