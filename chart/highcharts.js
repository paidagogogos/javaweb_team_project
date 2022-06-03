// import state from "/state.js";


// console.log("testChartData ", state.testChartData);

let minData = [0, 0, 0, 0, 0];
let maxData = [0, 0, 0, 0, 0];
let avgData = [0, 0, 0, 0, 0];
let sdData = [0, 0, 0, 0, 0];

var graph = Highcharts.chart("graph", {
    chart: {
        style: {
            fontFamily: "Medium"
        }
    },

    /* 차트명 */
    title: {
        text: 'Wait a Sec...',
    },

    /* 차트 부제 */
    subtitle: {
        text: "To load Database, You need to wait at least 10 seconds.",
    },

    /* X축 */
    xAxis: {
        categories: ["Core1", "Core2", "Core3", "Core4", "Core5"],
    },

    /* Y축 */
    yAxis: {
        title: {
            text: "Value",
        },
    },

    /* 범례 속성 */
    legend: {
        layout: "horizontal",
        align: "center",
        verticalAlign: "bottom",
    },

    /* 범례, 데이터 값 */
    series: [
        {
            name: "MIN",
            // [min1, min2, min3, min4, min5]
            data: minData,
        },
        {
            name: "MAX",
            data: maxData,
        },
        {
            name: "AVG",
            data: avgData,
        },
        {
            name: "SD",
            data: sdData,
        },
    ],
});
