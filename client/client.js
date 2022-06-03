function selectTask(task) {
  console.log(task);

  axios({
    method: "get",
    url: `/task/${task}`,
  }).then(function (response) {
    console.log("response", response.data);
    graph.update({
      title: {
          text: `${task}의 Core 별 수행 능력`
      },
      subtitle: {
        text: "Loading Complete!",
      },
      xAxis: {
          categories: ['core1','core2','core3','core4','core5']
      }
    });
    graph.series[0].setData(response.data.minData);
    graph.series[1].setData(response.data.maxData);
    graph.series[2].setData(response.data.avgData);
    graph.series[3].setData(response.data.sdData);
  });
}

function selectCore(core) {
  console.log(core);

  axios({
    method: "get",
    url: `/core/${core}`,
  }).then(function (response) {
    console.log("response", response.data);
    graph.update({
      title: {
          text: `${core}의 Task 별 수행 능력`
      },
      subtitle: {
        text: "Loading Complete!",
      },
      xAxis: {
          categories: ['task1','task2','task3','task4','task5']
      }
    });
    graph.series[0].setData(response.data.minData);
    graph.series[1].setData(response.data.maxData);
    graph.series[2].setData(response.data.avgData);
    graph.series[3].setData(response.data.sdData);
  });
}
