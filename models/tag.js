/**
 * Tag model module.
 * @file 标签数据模型
 * @module model/tag
 * @author biaochenxuying <https://github.com/biaochenxuying>
 */

const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 标签模型
const tagSchema = new mongoose.Schema({
	// 标签名称
	name: { type: String, required: true, validate: /\S+/ },

	// 标签描述
	desc: String,

	// 图标
	icon: String,

	// 发布日期
	create_time: { type: Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Date, default: Date.now },
});

// 自增ID插件配置
tagSchema.plugin(autoIncrement.plugin, {
	model: 'Tag',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

// 标签模型
module.exports = mongoose.model('Tag', tagSchema);
