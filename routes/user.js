const User = require('../models/user');
import { MD5_SUFFIX, responseClient, md5 } from '../util/util.js';

exports.login = (req, res) => {
	let { email, password } = req.body;
	if (!email) {
		responseClient(res, 400, 2, '用户邮箱不可为空');
		return;
	}
	if (!password) {
		responseClient(res, 400, 2, '密码不可为空');
		return;
	}
	User.findOne({
		email,
		password: md5(password + MD5_SUFFIX),
	})
		.then(userInfo => {
			if (userInfo) {
				//登录成功后设置session
				req.session.userInfo = userInfo;
				responseClient(res, 200, 0, '登录成功', userInfo);
			} else {
				responseClient(res, 400, 1, '用户名或者密码错误');
			}
		})
		.catch(err => {
			responseClient(res);
		});
};

//用户验证
exports.userInfo = (req, res) => {
	if (req.session.userInfo) {
		responseClient(res, 200, 0, '', req.session.userInfo);
	} else {
		responseClient(res, 200, 1, '请重新登录', req.session.userInfo);
	}
};

//后台当前用户
exports.currentUser = (req, res) => {
	let user = req.session.userInfo;
	if (user) {
		user.avatar = 'http://p61te2jup.bkt.clouddn.com/WechatIMG8.jpeg';
		user.notifyCount = 0;
		user.address = '广东省';
		user.country = 'China';
		user.group = 'BiaoChenXuying';
		(user.title = '交互专家'), (user.signature = '海纳百川，有容乃大');
		user.tags = [];
		user.geographic = {
			province: {
				label: '广东省',
				key: '330000',
			},
			city: {
				label: '广州市',
				key: '330100',
			},
		};
		responseClient(res, 200, 0, '', user);
	} else {
		responseClient(res, 200, 1, '请重新登录', user);
	}
};

exports.logout = (req, res) => {
	if (req.session.userInfo) {
		req.session.userInfo = null; // 删除session
		responseClient(res, 200, 0, '登出成功！！');
	} else {
		responseClient(res, 200, 1, '您还没登录！！！');
	}
};

exports.loginAdmin = (req, res) => {
	let { email, password } = req.body;
	if (!email) {
		responseClient(res, 400, 2, '用户邮箱不可为空');
		return;
	}
	if (!password) {
		responseClient(res, 400, 2, '密码不可为空');
		return;
	}
	User.findOne({
		email,
		password: md5(password + MD5_SUFFIX),
	})
		.then(userInfo => {
			if (userInfo) {
				if (userInfo.type === 0) {
					//登录成功后设置session
					req.session.userInfo = userInfo;
					responseClient(res, 200, 0, '登录成功', userInfo);
				} else {
					responseClient(res, 403, 1, '只有管理员才能登录后台！');
				}
			} else {
				responseClient(res, 400, 1, '用户名或者密码错误');
			}
		})
		.catch(err => {
			responseClient(res);
		});
};

exports.register = (req, res) => {
	let { name, password, phone, email, introduce, type } = req.body;
	if (!email) {
		responseClient(res, 400, 2, '用户邮箱不可为空');
		return;
	}
	if (!name) {
		responseClient(res, 400, 2, '用户名不可为空');
		return;
	}
	if (!password) {
		responseClient(res, 400, 2, '密码不可为空');
		return;
	}
	//验证用户是否已经在数据库中
	User.findOne({ email: email })
		.then(data => {
			if (data) {
				responseClient(res, 200, 1, '用户邮箱已存在！');
				return;
			}
			//保存到数据库
			let user = new User({
				email,
				name,
				password: md5(password + MD5_SUFFIX),
				phone,
				type,
				introduce,
			});
			user.save().then(data => {
				responseClient(res, 200, 0, '注册成功', data);
			});
		})
		.catch(err => {
			responseClient(res);
			return;
		});
};

exports.delUser = (req, res) => {
	let { id } = req.body;
	User.deleteMany({ _id: id })
		.then(result => {
			if (result.n === 1) {
				responseClient(res, 200, 0, '用户删除成功!');
			} else {
				responseClient(res, 200, 1, '用户不存在');
			}
		})
		.catch(err => {
			responseClient(res);
		});
};

exports.getUserList = (req, res) => {
	let keyword = req.query.keyword || '';
	let pageNum = parseInt(req.query.pageNum) || 1;
	let pageSize = parseInt(req.query.pageSize) || 10;
	let conditions = {};
	if (keyword) {
		const reg = new RegExp(keyword, 'i');
		conditions = { $or: [{ name: { $regex: reg } }, { email: { $regex: reg } }] };
	}
	let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
	let responseData = {
		count: 0,
		list: [],
	};
	User.countDocuments(conditions, (err, count) => {
		if (err) {
			console.error('Error:' + err);
		} else {
			responseData.count = count;
			// 待返回的字段
			let fields = {
				_id: 1,
				email: 1,
				name: 1,
				avatar: 1,
				phone: 1,
				introduce: 1,
				type: 1,
				create_time: 1,
			};
			let options = {
				skip: skip,
				limit: pageSize,
				sort: { create_time: -1 },
			};
			User.find(conditions, fields, options, (error, result) => {
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
