define(function(require, exports, module) {

	/* Simple JavaScript Inheritance
	 * By John Resig http://ejohn.org/
	 * MIT Licensed.
	 */
	(function() {
		var initializing = false,
			fnTest = /xyz/.test(function() {
				xyz;
			}) ? /\b_super\b/ : /.*/;
		this.Class = function() {};
		Class.extend = function(prop) {
			var _super = this.prototype;
			initializing = true;
			var prototype = new this();
			initializing = false;

			for (var name in prop) {
				prototype[name] = typeof prop[name] == "function" &&
					typeof _super[name] == "function" && fnTest.test(prop[name]) ?
					(function(name, fn) {
					return function() {
						var tmp = this._super;
						this._super = _super[name];
						var ret = fn.apply(this, arguments);
						this._super = tmp;
						return ret;
					};
				})(name, prop[name]) :
					prop[name];
			}

			function Class() {
				if (!initializing && this.init)
					this.init.apply(this, arguments);
			}
			Class.prototype = prototype;
			Class.prototype.constructor = Class;
			Class.extend = arguments.callee;

			return Class;
		};
	})();

	var requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
		};
	})();

	/**
	 * @method Min
	 * 返回数组中的最小值
	 */
	function Min(array) {
		return Math.min.apply(Math, array);
	};

	/**
	 * @method isNumber
	 * 判断参数是否是Number类型
	 */
	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	/**
	 * 如果valueToCap < minValue，则返回minValue
	 * 如果valueToCap > minValue && valueToCap < maxValue，则返回valueToCap
	 * 如果valueToCap > maxValue，则返回maxValue
	 */
	function CapValue(valueToCap, maxValue, minValue) {
		if (isNumber(maxValue)) {
			if (valueToCap > maxValue) {
				return maxValue;
			}
		}
		if (isNumber(minValue)) {
			if (valueToCap < minValue) {
				return minValue;
			}
		}
		return valueToCap;
	}

	/**
	 * @class Chart
	 * 图表父类
	 * -------------------------------------------------
	 */
	var Chart = Class.extend({

		init: function(data, options, context) {
			console.log('Chart init method involved.');
			var self = this;
			self.data = data;
			self.ctx = context;
			self.config = self.mergeChartConfig(self.defaults, options);
			self.width = context.canvas.width;
			self.height = context.canvas.height;
		},

		// 默认配置和用户自定义配置
		mergeChartConfig: function(defaults, userDefined) {
			var returnObj = {};
			for (var attrname in defaults) {
				returnObj[attrname] = defaults[attrname];
			}
			for (var attrname in userDefined) {
				returnObj[attrname] = userDefined[attrname];
			}
			return returnObj;
		},

		// 清屏
		clear: function(ctx) {
			ctx.clearRect(0, 0, this.width, this.height);
		},

		animationLoop: function(drawScale, drawData) {
			var self = this,
				config = self.config,
				ctx = self.ctx;
			var animFrameAmount = (config.animation) ? 1 / CapValue(config.animationSteps, Number.MAX_VALUE, 1) : 1,
				easingFunction = self.animationOptions[config.animationEasing], // 动画效果变化时间函数
				counter = 0; // 分几次画，已经画了多少次

			if (typeof drawScale !== "function") drawScale = function() {};

			requestAnimFrame(animLoop);

			function animLoop() {
				counter++;
				animateFrame();
				if (config.animation && counter < config.animationSteps) {
					requestAnimFrame(animLoop);
				} else {
					if (typeof config.onAnimationComplete == "function") config.onAnimationComplete();
				}
			}

			function animateFrame() {
				var easeAdjustedAnimationPercent = (config.animation) ? CapValue(easingFunction(counter / config.animationSteps), null, 0) : 1;
				self.clear(ctx);
				if (config.scaleOverlay) { //决定是先画坐标轴还是先画数据
					drawData.call(self, easeAdjustedAnimationPercent);
					drawScale.call(self);
				} else {
					drawScale.call(self);
					drawData.call(self, easeAdjustedAnimationPercent);
				}
			}
		},

		animationOptions: {
			linear: function(t) {
				return t;
			},
			easeInQuad: function (t) {
				return t*t;
			}
		}
	});

	/**
	 * @class Pie
	 * Pie chart
	 * -------------------------------------------------
	 */
	var Pie = Chart.extend({
		// 构造函数
		init: function(data, options, context) {
			console.log('Pie init method involved.');
			var self = this;
			self._super(data, options, context);
			self.segmentTotal = 0;
			self.pieRadius = Min([self.height / 2, self.width / 2]) - 25; // 饼状图半径

			for (var i = 0; i < data.length; i++) {
				self.segmentTotal += data[i].value;
			}

			self.animationLoop(self.drawScale, self.drawPieSegments);
		},

		defaults: {
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeWidth: 2,
			animation: true,
			animationSteps: 100,
			animationEasing: "easeInQuad",
			animateRotate: true,
			animateScale: false,
			onAnimationComplete: null
		},

		drawPieSegments: function(animationDecimal) {
			var self = this;
			var cumulativeAngle = -Math.PI / 2 ,
				scaleAnimation = 1,
				rotateAnimation = 1;
			if (self.config.animation) {
				if (self.config.animateScale) {
					scaleAnimation = animationDecimal;
				}
				if (self.config.animateRotate) {
					rotateAnimation = animationDecimal;
				}
			}
			for (var i = 0; i < self.data.length; i++) {
				var segmentAngle = rotateAnimation * ((self.data[i].value / self.segmentTotal) * (Math.PI * 2));
				self.ctx.beginPath();
				self.ctx.arc(self.width / 3, self.height / 2, scaleAnimation * self.pieRadius, cumulativeAngle, cumulativeAngle + segmentAngle);
				self.ctx.lineTo(self.width / 3, self.height / 2);
				self.ctx.closePath();
				self.ctx.fillStyle = self.data[i].color;
				self.ctx.fill();

				if (self.config.segmentShowStroke) {
					self.ctx.lineWidth = self.config.segmentStrokeWidth;
					self.ctx.strokeStyle = self.config.segmentStrokeColor;
					self.ctx.stroke();
				}
				cumulativeAngle += segmentAngle;
			}
		},

		drawScale: function() {
			var self = this,
				ctx = self.ctx,
				data = self.data;

			for(var i = 0; i < data.length; i++) {
				ctx.fillStyle = data[i].color;
				ctx.fillRect(self.width - 130, 25 + i * 25,30,15);
				ctx.fillStyle = '#666';
				ctx.fillText(data[i].tag, self.width - 80, 37 + i * 25);
			}
		}

	});

	/**
	 * @class Doughnut
	 * Doughnut chart
	 * -------------------------------------------------
	 */
	var Doughnut = Chart.extend({
		init: function(data, options, context) {
			console.log('Doughnut init method involved.');
			var self = this;
			self._super(data, options, context);
			self.segmentTotal = 0;
			self.doughnutRadius = Min([self.height/2, self.width/2]) - 25;
			self.cutoutRadius = self.doughnutRadius * (self.config.percentageInnerCutout/100);

			for (var i=0; i<data.length; i++){
				self.segmentTotal += data[i].value;
			}
			self.animationLoop(self.drawScale, self.drawPieSegments);
		},

		defaults: {
			segmentShowStroke : true,
			segmentStrokeColor : "#fff",
			segmentStrokeWidth : 2,
			percentageInnerCutout : 40,
			animation : true,
			animationSteps : 20,
			animationEasing : "easeInQuad",
			animateRotate : true,
			animateScale : false,
			onAnimationComplete : null
		},

		drawPieSegments: function(animationDecimal) {
			var self = this;
			var cumulativeAngle = -Math.PI/2,
				scaleAnimation = 1,
				rotateAnimation = 1;

			if(self.config.animation) {
				if(self.animateScale) {
					scaleAnimation = animationDecimal;
				}
				if(self.config.animateRotate) {
					rotateAnimation = animationDecimal;
				}
			}

			for(var i = 0; i < self.data.length; i++) {
				var segmentAngle = rotateAnimation * ((self.data[i].value / self.segmentTotal) * (Math.PI*2));
				self.ctx.beginPath();
				self.ctx.arc(self.width/2.5,self.height/2,scaleAnimation * self.doughnutRadius, cumulativeAngle, cumulativeAngle + segmentAngle, false);
				self.ctx.arc(self.width/2.5,self.height/2,scaleAnimation * self.cutoutRadius,cumulativeAngle + segmentAngle,cumulativeAngle,true);
				self.ctx.closePath();
				self.ctx.fillStyle = self.data[i].color;
				self.ctx.fill();

				if(self.config.segmentShowStroke) {
					self.ctx.lineWidth = self.config.segmentStrokeWidth;
					self.ctx.strokeStyle = self.config.segmentStrokeColor;
					self.ctx.stroke();
				}
				cumulativeAngle += segmentAngle;
			}
		},

		drawScale: function() {
			var self = this,
				ctx = self.ctx,
				data = self.data;

			for(var i = 0; i < data.length; i++) {
				ctx.fillStyle = data[i].color;
				ctx.fillRect(self.width - 130, 25 + i * 25,30,15);
				ctx.fillStyle = '#666';
				ctx.fillText(data[i].tag, self.width - 80, 37 + i * 25);
			}
		}

	});

	/**
	 * @class Bar
	 * Bar chart
	 * -------------------------------------------------
	 */
	var Bar = Chart.extend({

		init: function(data, options, context) {
			var self = this;
			self._super(data, options, context);

			self.animationLoop(self.drawScale, self.drawBars);
		},

		defaults: {

		},

		drawBars: function(animPc) {

		},

		drawScale: function() {

		}


	});

	


	exports.Pie = Pie;
	exports.Doughnut = Doughnut;
	exports.Bar = Bar;


});