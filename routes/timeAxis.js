import { responseClient } from '../util/util';
import TimeAxis from '../models/timeAxis';

//获取全部时间轴内容
exports.getTimeAxisList = (req, res) => {
  let keyword = req.query.keyword || null;
  let state = req.query.state || '';
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  let conditions = {};
  if (!state) {
    if (keyword) {
      const reg = new RegExp(keyword, 'i'); //不区分大小写
      conditions = {
        $or: [{ title: { $regex: reg } }, { content: { $regex: reg } }],
      };
    }
  } else if (state) {
    state = parseInt(state);
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      conditions = {
        $and: [
          { $or: [{ state: state }] },
          { $or: [{ title: { $regex: reg } }, { content: { $regex: reg } }] },
        ],
      };
    } else {
      conditions = { state };
    }
  }

  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
  let responseData = {
    count: 0,
    list: [],
  };
  TimeAxis.countDocuments({}, (err, count) => {
    if (err) {
      console.error('Error:' + err);
    } else {
      responseData.count = count;
      let fields = {
        title: 1,
        content: 1,
        state: 1,
        start_time: 1,
        end_time: 1,
        // update_time: 1,
      }; // 待返回的字段
      let options = {
        skip: skip,
        limit: pageSize,
        sort: { end_time: -1 },
      };
      TimeAxis.find(conditions, fields, options, (error, result) => {
        if (err) {
          console.error('Error:' + error);
          // throw error;
        } else {
          responseData.list = result;
          responseClient(res, 200, 0, '操作成功！', responseData);
        }
      });
    }
  });
};

exports.addTimeAxis = (req, res) => {
  let { title, state, content, start_time, end_time } = req.body;
  TimeAxis.findOne({
    title,
  })
    .then(result => {
      if (!result) {
        let timeAxis = new TimeAxis({
          title,
          state,
          content,
          start_time,
          end_time,
        });
        timeAxis
          .save()
          .then(data => {
            responseClient(res, 200, 0, '操作成功！', data);
          })
          .catch(err => {
            console.error('err :', err);
            // throw err;
          });
      } else {
        responseClient(res, 200, 1, '该时间轴内容已存在');
      }
    })
    .catch(errro => {
      console.error('errro :', errro);
      responseClient(res);
    });
};

exports.updateTimeAxis = (req, res) => {
  let { id, title, state, content, start_time, end_time } = req.body;

  TimeAxis.updateOne(
    { _id: id },
    {
      title,
      state: Number(state),
      content,
      start_time,
      end_time,
      update_time: new Date(),
    },
  )
    .then(result => {
      // console.log(result);
      responseClient(res, 200, 0, '操作成功', result);
    })
    .catch(err => {
      console.error('err:', err);
      responseClient(res);
    });
};

exports.delTimeAxis = (req, res) => {
  let { id } = req.body;
  TimeAxis.deleteMany({ _id: id })
    .then(result => {
      // console.log('result :', result)
      if (result.n === 1) {
        responseClient(res, 200, 0, '操作成功!');
      } else {
        responseClient(res, 200, 1, '时间轴内容不存在');
      }
    })
    .catch(err => {
      console.error('err :', err);
      responseClient(res);
    });
};

// 详情
exports.getTimeAxisDetail = (req, res) => {
  let { id } = req.body;
  TimeAxis.findOne({ _id: id })
    .then(data => {
      responseClient(res, 200, 0, '操作成功！', data);
    })
    .catch(err => {
      console.error('err :', err);
      responseClient(res);
    });
};
