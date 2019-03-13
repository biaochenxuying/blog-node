import { responseClient } from '../util/util';
import Link from '../models/link';

//获取全部链接
exports.getLinkList = (req, res) => {
	let keyword = req.query.keyword || '';
	let type = Number(req.query.type); // 1 :其他友情链接 2: 是博主的个人链接 ,‘’ 代表所有链接
	let pageNum = parseInt(req.query.pageNum) || 1;
	let pageSize = parseInt(req.query.pageSize) || 10;
	let conditions = {};
	if (type) {
		if (keyword) {
			const reg = new RegExp(keyword, 'i');
			conditions = {
				$and: [{ $or: [{ type: type }] }, { $or: [{ name: { $regex: reg } }, { desc: { $regex: reg } }] }],
			};
		} else {
			conditions = { type };
		}
	} else {
		if (keyword) {
			const reg = new RegExp(keyword, 'i');
			conditions = { $or: [{ name: { $regex: reg } }, { desc: { $regex: reg } }] };
		}
	}

	let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
	let responseData = {
		count: 0,
		list: [],
	};
	Link.countDocuments(conditions, (err, count) => {
		if (err) {
			console.error('Error:' + err);
		} else {
			responseData.count = count;
			// 待返回的字段
			let fields = {
				_id: 1,
				name: 1,
				// desc: 1,
				// type: 1,
				url: 1,
				icon: 1,
				// state: 1,
				// create_time: 1,
			};
			let options = {
				skip: skip,
				limit: pageSize,
				sort: { create_time: -1 },
			};
			Link.find(conditions, fields, options, (error, result) => {
				if (err) {
					console.error('Error:' + error);
					// throw error;
				} else {
					responseData.list = result;
					responseClient(res, 200, 0, 'success', responseData);
				}
			});
		}
	});
};
exports.addLink = (req, res) => {
	let { name, desc, icon, url, type } = req.body;
	Link.findOne({
		name,
	})
		.then(result => {
			if (!result) {
				let link = new Link({
					name,
					desc,
					icon,
					url,
					type,
				});
				link
					.save()
					.then(data => {
						responseClient(res, 200, 0, '添加成功', data);
					})
					.catch(err => {
						throw err;
					});
			} else {
				responseClient(res, 200, 1, '该链接名已存在');
			}
		})
		.catch(err => {
			responseClient(res);
		});
};
//
exports.updateLink = (req, res) => {
	const { state, id } = req.body;
	Link.update(
		{ _id: id },
		{
			state,
		},
	)
		.then(result => {
			responseClient(res, 200, 0, '操作成功', result);
		})
		.catch(err => {
			console.error(err);
			responseClient(res);
		});
};
exports.delLink = (req, res) => {
	let { id } = req.body;
	Link.deleteMany({ _id: id })
		.then(result => {
			if (result.n === 1) {
				responseClient(res, 200, 0, '删除成功!');
			} else {
				responseClient(res, 200, 1, '标签不存在');
			}
		})
		.catch(err => {
			console.error(err);
			responseClient(res);
		});
};
