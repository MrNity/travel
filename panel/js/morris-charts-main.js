$(function () {
    "use strict";

    // LINE CHART
    var line = new Morris.Line({
      element: 'line-chart',
      resize: true,
      data: [
        {y: '2020-07-01', item1: 18},
        {y: '2020-07-02', item1: 26},
        {y: '2020-07-03', item1: 25},
        {y: '2020-07-04', item1: 25},
        {y: '2020-07-05', item1: 26},
        {y: '2020-07-06', item1: 20},
        {y: '2020-07-07', item1: 25}
      ],
		xkey: 'y',
		ykeys: ['item1'],
		labels: ['Сумма'],
		lineWidth: 3,
		pointFillColors: ['#1e54e5'],
		lineColors: ['#1e88e5'],
		hideHover: 'auto',
    });

    //BAR CHART
    var bar = new Morris.Bar({
      element: 'bar-chart',
      resize: false,
      data: [
        {y: 'Пн', a: 25, b: 35},
        {y: 'Вт', a: 43, b: 53},
        {y: 'Ср', a: 34, b: 94},
        {y: 'Чт', a: 45, b: 55},
        {y: 'Пт', a: 57, b: 77},
        {y: 'Сб', a: 10, b: 60},
		{y: 'Вс', a: 86, b: 96}
      ],
		barColors: ['#1e54e5', '#1e88e5'],
		barSizeRatio: 0.5,
		barGap: 5,
		xkey: 'y',
		ykeys: ['a', 'b'],
		labels: ['Посетителей', 'Просмотров'],
		hideHover: 'auto'
    });
  });