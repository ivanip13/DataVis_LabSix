export default function StackedAreaChart(container){

    const margin = { top: 40, right: 20, bottom: 40, left: 90 }
    const width = 800 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom;

    let sector = "" // Empty string for tooltip text

    let svg = d3.select(".stacked-area-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("clip-path", "url(#clip)")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prevemt Area from overextending
    svg.append("defs")
          .append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

    let group = svg.append('g')

    const tooltip = svg
        .append("text")
        .text(sector)
        .attr('x', 5)
        .attr('y', 0)
        .attr('font-size', 12);

    let yScale = d3.scaleLinear()
        .range([height,0])
    let xScale = d3.scaleTime()
        .range([0,width])

    let yAxis = d3.axisLeft()
        .scale(yScale);
    let xAxis = d3.axisBottom()
        .scale(xScale)

    let yAxisGroup = svg.append('g')
        .attr('class', 'axis y-axis');
    let xAxisGroup = svg.append("g")
        .attr('class', 'axis x-axis')

    let selected = null, xDomain, data;
    let info;

  // Click will update selected,data and svg
   function chartupdate(selected, data, svg){
        svg.select('axis y-axis').exit().remove()
        let colorScale = d3.scaleOrdinal(d3.schemeTableau10)
       .domain(data.columns.slice(1));

        let margin = { top: 40, right: 20, bottom: 40, left: 90 }
        let width = 800 - margin.left - margin.right
        let height = 400 - margin.top - margin.bottom;

        let sector = ""
        let selection;
        let yScale = d3.scaleLinear()
            .range([height,0])
        let xScale = d3.scaleTime()
             .range([0,width])

       let yAxis = d3.axisLeft().scale(yScale);
       let xAxis = d3.axisBottom().scale(xScale);

       xScale.domain(xDomain? xDomain: d3.extent(data, d=>d.date));
       yScale.domain([0, d3.max(data, d=>d[selected])]);

       var mainarea = d3.area()
       .x((d)  =>xScale(d.date))
       .y0(()  =>yScale(0))
       .y1((d) =>yScale(d[selected]));

       svg.append("path")
       .attr("class", "mainarea")
       .attr("fill", d=>colorScale(selected))

       .on("click", (event, d) => {
           svg.selectAll('.mainarea').remove()
           update(data)
       })
           d3.select(".mainarea")
            .datum(data)
            .attr("d",mainarea)
           xAxisGroup.call(xAxis)
           yAxisGroup.call(yAxis)
        }

   function update(_data){
     //

       svg.selectAll('.mainarea').exit().remove()
       svg.select('axis y-axis').exit().remove()

       if (info == null){
           info = _data}
           //

       selected = null
       data = _data;
       //

       const keys = selected? [selected] : data.columns.slice(1)
       //
       let stack = d3.stack()
           .keys(data.columns.slice(1))
           .order(d3.stackOrderNone)
           .offset(d3.stackOffsetNone);

       var series = stack(data);

       xScale.domain(xDomain? xDomain: d3.extent(data, d=>d.date));
       yScale.domain([0, d3.max(data, d=>d.total)]);

       let colorScale = d3.scaleOrdinal(d3.schemeTableau10)
           .domain(data.columns.slice(1));

       let updatearea = d3.area()
           .x(d=>xScale(d.data.date))
           .y0(d=>yScale(d[0]))
           .y1(d=>yScale(d[1]))

      const areas = group.selectAll('.updatearea')
            .data(series, (d) => d.key);

       svg.select('.x-axis')
           .call(xAxis)
           .attr("transform", `translate(0, ${height})`);

       svg.select('.y-axis')
           .call(yAxis)

        areas.enter()
            .append('path')
            .attr('class', 'updatearea')
            .attr("fill", d=>colorScale(d.key))
            .attr("clip-path", "url(#clip)")
            .on("mouseover", (event, d, i) => tooltip.text((d.key)))
            .on("mouseout", (event, d) => tooltip.text(""))
            .on("click", (event, d) => {
                    selected = d.key;
                    svg.selectAll('path').remove()
                    chartupdate(selected, info, svg)
            })
            .merge(areas)
            .attr("d", updatearea)

        areas.exit().remove()
   }

   function filterByDate(range){
       xDomain = range;
       console.log(xDomain);
       if (selected != null){chartupdate(selected, data, svg)}
       else {update(data);
       }
   }
   return {chartupdate,
       update,
       filterByDate
   }
};
