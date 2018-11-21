/**
 * Message model module.
 * @file 留言模型
 * @module model/message
 * @author biaochenxuying <https://github.com/biaochenxuying>
 */

const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 留言模型
const messageSchema = new mongoose.Schema({
	// 用户 id
	user_id: { type: String, default: '' },

	// 姓名
	name: { type: String, default: '' },

	// 头像
	avatar: { type: String, default: 'user' },

	// 电话
	phone: { type: String, default: '' },

	// 介绍
	introduce: { type: String, default: '' },

	// 留言内容
	content: { type: String, required: true },

	// 回复留言内容
	reply_list: [
		{
			content: { type: String, required: true },
		},
	],

	// 邮箱
	email: { type: String, default: '' },

	// 状态 0 是未处理，1 是已处理
	state: { type: Number, default: 0 },

	// 创建日期
	create_time: { type: Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Date, default: Date.now },
});

// 自增ID插件配置
messageSchema.plugin(autoIncrement.plugin, {
	model: 'Message',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});


// 留言模型
module.exports = mongoose.model('Message', messageSchema);
