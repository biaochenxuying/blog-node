/**
 * Comment model module.
 * @file 评论数据模型
 * @module model/comment
 * @author biaochenxuying <https://github.com/biaochenxuying>
 */

const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 评论模型
const commentSchema = new mongoose.Schema({
	// 评论所在的文章 id
	article_id: { type: mongoose.Schema.Types.ObjectId, required: true },

	// content
	content: { type: String, required: true, validate: /\S+/ },

	// 是否置顶
	is_top: { type: Boolean, default: false },

	// 被赞数
	likes: { type: Number, default: 0 },

	// 用户 id
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

	// 父评论的用户信息
	user: {
		// 用户id
		user_id: { type: mongoose.Schema.Types.ObjectId },

		// 名字
		name: { type: String, required: true, default: '' },

		// 用户类型 0：博主 1：其他用户
		type: { type: Number, default: 1 },

		// 头像
		avatar: { type: String, default: 'user' },
	},

	// 第三者评论
	other_comments: [
		{
			// 谁在评论
			user: {
				user_id: { type: mongoose.Schema.Types.ObjectId },

				// 名字
				name: { type: String, required: true, default: '' },

				// 用户类型 0：博主 1：其他用户
				type: { type: Number, default: 1 },

				// 头像
				avatar:{type: String,  default: 'user' }
			},

			// 对谁评论
			to_user: { 
				user_id: { type: mongoose.Schema.Types.ObjectId },

				// 名字
				name: { type: String, required: true, default: '' },

				// 用户类型 0：博主 1：其他用户
				type: { type: Number, default: 1 },

				// 头像
				avatar:{type: String,  default: 'user' }
			},

			// 被赞数
			likes: { type: Number, default: 0 },

			// content
			content: { type: String, required: true, validate: /\S+/ },

			// 状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论
			state: { type: Number, default: 1 },

			// 创建日期
			create_time: { type: Date, default: Date.now },
		},
	],

	// 状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论
	state: { type: Number, default: 1 },

	// 是否已经处理过 => 1 是 / 2 否 ；新加的评论需要审核，防止用户添加 垃圾评论
	is_handle: { type: Number, default: 2 },

	// 创建日期
	create_time: { type: Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Date, default: Date.now },
});

// 自增 ID 插件配置
commentSchema.plugin(autoIncrement.plugin, {
	model: 'Comment',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

// 标签模型
module.exports = mongoose.model('Comment', commentSchema);
