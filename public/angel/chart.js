define(function(require, exports, module) {

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

		init: function(context) {
			console.log('Chart init method involved.');
			this.width = context.canvas.width;
			this.height = context.canvas.height;
		},
		
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

		clear: function(ctx) {
			ctx.clearRect(0, 0, this.width, this.height);
		},

		animationLoop: function(drawScale, drawData) {
			var me = this,
				config = me.config,
				ctx = me.ctx;
			var animFrameAmount = (config.animation) ? 1 / CapValue(config.animationSteps, Number.MAX_VALUE, 1) : 1, // 动画帧数
				easingFunction = me.animationOptions[config.animationEasing], // 动画效果变化时间函数
				percentAnimComplete = (config.animation) ? 0 : 1; // 动画完成百分比

			if (typeof drawScale !== "function") drawScale = function() {};

			requestAnimFrame(animLoop);

			function animLoop() {
				percentAnimComplete += animFrameAmount;
				animateFrame();
				if (percentAnimComplete <= 1) {
					requestAnimFrame(animLoop);
				} else {
					if (typeof config.onAnimationComplete == "function") config.onAnimationComplete();
				}
			}

			function animateFrame() {
				var easeAdjustedAnimationPercent = (config.animation) ? CapValue(easingFunction(percentAnimComplete), null, 0) : 1;
				me.clear(ctx);
				if (config.scaleOverlay) {
					drawData.call(me, easeAdjustedAnimationPercent);
					drawScale();
				} else {
					drawScale();
					drawData.call(me, easeAdjustedAnimationPercent);
				}
			}
		},

		animationOptions: {
			linear: function(t) {
				return t;
			}
		}
	});

	/**
	 * @class Pie
	 * Pie chart
	 * -------------------------------------------------
	 */
	var Pie = Chart.extend({
		
		init: function(data, options, context) {
			console.log('Pie init method involved.');
			var me = this;
			me._super(context);
			me.data = data;
			me.ctx = context;
			me.config = me.mergeChartConfig(me.defaults, options);
			me.segmentTotal = 0; 
			me.pieRadius = Min([me.height / 2, me.width / 2]) - 15; // 饼状图半径

			for (var i = 0; i < data.length; i++) {
				me.segmentTotal += data[i].value;
			}

			me.animationLoop(null, me.drawPieSegments);
		},

		defaults: {
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeWidth: 2,
			animation: true,
			animationSteps: 100,
			animationEasing: "easeOutBounce",
			animateRotate: true,
			animateScale: false,
			onAnimationComplete: null
		},

		drawPieSegments: function(animationDecimal) {
			var me = this;
			var cumulativeAngle = -Math.PI / 2,
				scaleAnimation = 1,
				rotateAnimation = 1;
			if (this.config.animation) {
				if (this.config.animateScale) {
					scaleAnimation = animationDecimal;
				}
				if (this.config.animateRotate) {
					rotateAnimation = animationDecimal;
				}
			}
			for (var i = 0; i < this.data.length; i++) {
				var segmentAngle = rotateAnimation * ((this.data[i].value / this.segmentTotal) * (Math.PI * 2));
				this.ctx.beginPath();
				this.ctx.arc(this.width / 2, this.height / 2, scaleAnimation * this.pieRadius, cumulativeAngle, cumulativeAngle + segmentAngle);
				this.ctx.lineTo(this.width / 2, this.height / 2);
				this.ctx.closePath();
				this.ctx.fillStyle = this.data[i].color;
				this.ctx.fill();

				if (this.config.segmentShowStroke) {
					this.ctx.lineWidth = this.config.segmentStrokeWidth;
					this.ctx.strokeStyle = this.config.segmentStrokeColor;
					this.ctx.stroke();
				}
				cumulativeAngle += segmentAngle;
			}
		}

	});

	/**
	 * @class Bar
	 * Bar chart
	 * -------------------------------------------------
	 */
	var Bar = Chart.extend({

	});

	/**
	 * @class Line
	 * Line chart
	 * -------------------------------------------------
	 */
	var Line = Chart.extend({

	});

	exports.Pie = Pie;
	exports.Bar = Bar;
	exports.Line = Line;


});