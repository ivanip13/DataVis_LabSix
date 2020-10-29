export default function AreaChart(container){


    const margin = ({ top: 40, right: 20, bottom: 40, left: 90 });
    const width = 800 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
    let selection;

    let svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    let xScale = d3
        .scaleTime()
        .range([0,width])

    let yScale = d3
        .scaleLinear()
        .range([height,0])

    svg.append("path")
        .attr("class", "area")
        .attr("fill", 'steelblue')

    let xAxis = d3.axisBottom()
        .scale(xScale)

    let yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(3);

    svg.append("g")
        .attr('class', 'axis x-axis');

    svg.append('g')
        .attr('class', 'axis y-axis');

    const listeners = { brushed: null };

    const brush = d3
        .brushX()
        .extent([[0,0],[width,height]])
        .on('brush', brushed)
        .on('end', brushed);

    svg.append("g").attr('class', 'brush').call(brush);

    function brushed(event) {
        if (event.selection) {console.log("brushed", event.selection);
          listeners["brushed"](event.selection.map(xScale.invert));
        }
      }

    function update(data){
        yScale.domain([0, d3.max(data, d=>d.total)]);
        xScale.domain(d3.extent(data, d=>d.date));
        let area = d3.area()
            .x(function(d) { return xScale(d.date); })
            .y0(function() { return yScale(0); })
            .y1(function(d) { return yScale(d.total); })
        d3.select(".area")
            .datum(data)
            .attr("d",area)
        svg.select('.y-axis')
            .call(yAxis)
        svg.select('.x-axis')
            .call(xAxis)
            .attr("transform", `translate(0, ${height})`);
    }

    function on(event, listener) {listeners[event] = listener;}

	return {update,
        on
    }


};
