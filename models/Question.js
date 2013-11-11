var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * title 问题标题
 * content 问题详细内容
 * createTime 
 */
var QuestionSchema = new Schema({
	title: String,
	content: String,
	author: Schema.Types.ObjectId,
	tags: Array,
	answerCounter: Number,
	viewCounter: Number,
	createTime: {
		type: Date,
		default: Date.now
	},
	updateTime: {
		type: Date
	}
});

// define our own custom document instance methods
QuestionSchema.methods = {
	sayHello: function() {
		console.log('hello');
	}
};

// Adding static methods to a Model is simple as well
QuestionSchema.statics = {
	sayWorld: function() {
		console.log('world');
	}
};


//compile schema to model
module.exports = mongoose.model('Question', QuestionSchema, 'wt_questions');
