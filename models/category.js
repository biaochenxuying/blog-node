/**
 * Category model module.
 * @file 分类数据模型
 * @module model/category
 * @author biaochenxuying <https://github.com/biaochenxuying>
 */

const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 分类集合模型
const categorySchema = new mongoose.Schema({
	// 分类名称
	name: { type: String, required: true, validate: /\S+/ },

	// 分类描述
	desc: { type: String, default: '' },

	// 创建日期
	create_time: { type: Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Date, default: Date.now },
});


//自增 ID 插件配置
categorySchema.plugin(autoIncrement.plugin, {
	model: 'Category',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});


// 分类模型
module.exports = mongoose.model('Category', categorySchema);
