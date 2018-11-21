/**
 * TimeAxis model module.
 * @file 时间轴模型
 * @module model/timeAxis
 * @author biaochenxuying <https://github.com/biaochenxuying>
 */

const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 时间轴模型
const timeAxisSchema = new mongoose.Schema({
	// 标题
	title: { type: String, required: true },

	// 时间轴内容
	content: { type: String, required: true },

	// 状态 1 是已经完成 ，2 是正在进行，3 是没完成
	state: { type: Number, default: 1 },

	// 开始日期
	start_time: { type: Date, default: Date.now },

	// 结束日期
	end_time: { type: Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Date, default: Date.now },
});

// 自增ID插件配置
timeAxisSchema.plugin(autoIncrement.plugin, {
	model: 'TimeAxis',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

// 时间轴模型
module.exports = mongoose.model('TimeAxis', timeAxisSchema);
