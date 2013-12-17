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

	function Min(array) {
		return Math.min.apply(Math, array);
	};

	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

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
			var me = this;
			ctx.clearRect(0, 0, me.width, me.height);
		},

		animationLoop: function(config, drawScale, drawData, ctx) {
			var me = this;
			var animFrameAmount = (config.animation) ? 1 / CapValue(config.animationSteps, Number.MAX_VALUE, 1) : 1,
				easingFunction = this.animationOptions[config.animationEasing],
				percentAnimComplete = (config.animation) ? 0 : 1;

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
		// 组件初始化时自动调用的方法
		init: function(data, options, context) {
			var me = this;
			this._super(context);
			console.log('Pie init method involved.');
			this.data = data;
			this.ctx = context;
			this.config = this.mergeChartConfig(this.defaults, options);
			this.segmentTotal = 0;
			this.pieRadius = Min([this.height / 2, this.width / 2]) - 5; //半径

			for (var i = 0; i < data.length; i++) {
				this.segmentTotal += data[i].value;
			}

			this.animationLoop(me.config, null, me.drawPieSegments, context);

		},
		// Pie chart default config.
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


	exports.Pie = Pie;
	exports.Bar = Bar;


});