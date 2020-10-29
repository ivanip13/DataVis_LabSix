import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

// input: selector for a chart container e.g., ".chart"


let information;
d3.csv('unemployment.csv', d3.autoType)
  .then(data=>{
    // process data and create charts

    information = data;
    let i;
    for(i=0; i<information.length; i++){
      var sum = 0;
      for (var key in Object.values(information[i])) {
        if (Object.values(information[i]).hasOwnProperty(key)) {
        if (Number.isInteger(Object.values(information[i])[key])){
          sum = sum +Object.values(information[i])[key];
        }
          information[i].total = sum;
        }
        }
      }

      let stackedAreaChart = StackedAreaChart(".stacked-area-chart");
      stackedAreaChart.update(information);

      const areaChart = AreaChart(".area_chart");
      areaChart.update(information);

      areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); // coordinating with stackedAreaChart
    })




    });
