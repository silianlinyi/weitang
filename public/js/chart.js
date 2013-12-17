define(function(require, exports, module) {

	var Pie = window.Pie = require('../angel/chart').Pie;
	var Bar = window.Bar = require('../angel/chart').Bar;


	var canvas = document.getElementById('myCanvas'),
		ctx = canvas.getContext('2d');

	var pieData = [{
		value: 30,
		color: "#F38630"
	}, {
		value: 40,
		color: "#E0E4CC"
	}, {
		value: 100,
		color: "#69D2E7"
	}];

	var options = {
		segmentShowStroke: true, // 是否显示边框
		segmentStrokeColor: "#fff", // 边框颜色
		segmentStrokeWidth: 1, // 边框宽度
		animation: true, // 是否开启动画效果
		animationSteps: 20, //Number - Amount of animation steps
		animationEasing: "linear", // 动画效果
		animateRotate: true, //Boolean - Whether we animate the rotation of the Pie
		animateScale: false, //Boolean - Whether we animate scaling the Pie from the centre
		onAnimationComplete: function() {
			console.log('onAnimationComplete');
		}
	};


	var myPie = window.pie = new Pie(pieData, options, ctx);

});