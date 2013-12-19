define(function(require, exports, module) {

	var Chart = require('../angel/chart');

	// Pie Test
	// ------------------------------------------------------
	var Pie = window.Pie = Chart.Pie;
	var pieCanvas = document.getElementById('pieCanvas'),
		pieContext = pieCanvas.getContext('2d');

	var pieData = [{
		value: 30,
		color: "#F38630",
		tag: "谷歌搜索"
	}, {
		value: 40,
		color: "#E0E4CC",
		tag: "360搜索"
	}, {
		value: 100,
		color: "#69D2E7",
		tag: "百度搜索"
	}, {
		value: 20,
		color: "red",
		tag: "搜搜"
	}];

	var pieOptions = {
		segmentShowStroke: true, // 是否显示边框
		segmentStrokeColor: "#fff", // 边框颜色
		segmentStrokeWidth: 2, // 边框宽度
		animation: true, // 是否开启动画效果
		animationSteps: 20, //Number - Amount of animation steps
		animationEasing: "easeInQuad", // 动画效果
		animateRotate: true, //Boolean - Whether we animate the rotation of the Pie
		animateScale: false, //Boolean - Whether we animate scaling the Pie from the centre
		onAnimationComplete: function() {
			console.log('onAnimationComplete');
		}
	};

	var pie = window.pie = new Pie(pieData, pieOptions, pieContext);

	// Doughnut Test
	// ------------------------------------------------------
	var Doughnut = window.Doughnut = Chart.Doughnut;
	var doughnutCanvas = document.getElementById('doughnutCanvas'),
		doughnutContext = doughnutCanvas.getContext('2d');

	var doughnutData = [{
		value: 30,
		color:"#F7464A",
		tag: "谷歌搜索"
	}, {
		value : 50,
		color : "#E2EAE9",
		tag: "360搜索"
	}, {
		value : 100,
		color : "#D4CCC5",
		tag: "百度搜索"
	}, {
		value : 40,
		color : "#949FB1",
		tag: "搜搜"
	}];

	var doughnutOptions = {

	};

	var doughnut = window.doughnut = new Doughnut(doughnutData, doughnutOptions, doughnutContext);

	// Bar Test
	// ------------------------------------------------------
	var Bar = window.Bar = Chart.Bar;
	var barCanvas = document.getElementById('barCanvas'),
		barContext = barCanvas.getContext('2d');

	var barData = [

	];

	var barOptions = {

	};

	var bar = window.bar = new Bar(barData, barOptions, barContext);





});