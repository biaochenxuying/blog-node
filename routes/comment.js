import { responseClient } from '../util/util';
import Comment from '../models/comment';
import User from '../models/user';
import Article from '../models/article';

//获取全部评论
exports.getCommentList = (req, res) => {
  let keyword = req.query.keyword || null;
  let is_handle = parseInt(req.query.is_handle) || 0;
  // console.log('is_handle ', is_handle);
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  let conditions = {};
  if (keyword) {
    const reg = new RegExp(keyword, 'i'); //不区分大小写
    if (is_handle) {
      conditions = {
        content: { $regex: reg },
        is_handle,
      };
    } else {
      conditions = {
        content: { $regex: reg },
      };
    }
  }
  if (is_handle) {
    conditions = {
      is_handle,
    };
    console.log('conditions', conditions);
  }

  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
  let responseData = {
    count: 0,
    list: [],
  };

  Comment.countDocuments({}, (err, count) => {
    if (err) {
      console.error('Error:' + err);
    } else {
      responseData.count = count;
      // 待返回的字段
      let fields = {
        article_id: 1,
        content: 1,
        is_top: 1,
        likes: 1,
        user_id: 1,
        user: 1,
        other_comments: 1,
        state: 1,
        is_handle: 1,
        create_time: 1,
        // update_time: 1,
      };
      let options = {
        skip: skip,
        limit: pageSize,
        sort: { create_time: -1 },
      };
      Comment.find(conditions, fields, options, (error, result) => {
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

// 添加一级评论
exports.addComment = (req, res) => {
  if (!req.session.userInfo) {
    responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
    return;
  }
  let { article_id, user_id, content } = req.body;
  User.findById({
    _id: user_id,
  })
    .then(result => {
      // console.log('result :', result);
      if (result) {
        let userInfo = {
          user_id: result._id,
          name: result.name,
          type: result.type,
          avatar: result.avatar,
        };
        let comment = new Comment({
          article_id: article_id,
          content: content,
          user_id: user_id,
          user: userInfo,
        });
        comment
          .save()
          .then(commentResult => {
            Article.findOne({ _id: article_id }, (errors, data) => {
              if (errors) {
                console.error('Error:' + errors);
                // throw errors;
              } else {
                data.comments.push(commentResult._id);
                data.meta.comments = data.meta.comments + 1;
                Article.updateOne(
                  { _id: article_id },
                  { comments: data.comments, meta: data.meta, is_handle: 0 },
                )
                  .then(result => {
                    responseClient(res, 200, 0, '操作成功 ！', commentResult);
                  })
                  .catch(err => {
                    console.error('err :', err);
                    throw err;
                  });
              }
            });
          })
          .catch(err2 => {
            console.error('err :', err2);
            throw err2;
          });
      } else {
        responseClient(res, 200, 1, '用户不存在');
      }
    })
    .catch(error => {
      console.error('error :', error);
      responseClient(res);
    });
};

// 添加第三者评论
exports.addThirdComment = (req, res) => {
  if (!req.session.userInfo) {
    responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
    return;
  }
  let { article_id, comment_id, user_id, content, to_user } = req.body;
  Comment.findById({
    _id: comment_id,
  })
    .then(commentResult => {
      User.findById({
        _id: user_id,
      })
        .then(userResult => {
          if (userResult) {
            let userInfo = {
              user_id: userResult._id,
              name: userResult.name,
              type: userResult.type,
              avatar: userResult.avatar,
            };
            let item = {
              user: userInfo,
              content: content,
              to_user: JSON.parse(to_user),
            };
            commentResult.other_comments.push(item);
            Comment.updateOne(
              { _id: comment_id },
              {
                other_comments: commentResult.other_comments,
                is_handle: 2,
              },
            )
              .then(result => {
                // responseClient(res, 200, 0, '操作成功', result);
                Article.findOne({ _id: article_id }, (errors, data) => {
                  if (errors) {
                    console.error('Error:' + errors);
                    // throw errors;
                  } else {
                    data.meta.comments = data.meta.comments + 1;
                    Article.updateOne({ _id: article_id }, { meta: data.meta })
                      .then(Articleresult => {
                        // console.log('result --------------:', Articleresult);
                        responseClient(
                          res,
                          200,
                          0,
                          '操作成功 ！',
                          Articleresult,
                        );
                      })
                      .catch(err => {
                        // console.log('err ===========:', err);
                        throw err;
                      });
                  }
                });
              })
              .catch(err1 => {
                console.error('err1:', err1);
                responseClient(res);
              });
          } else {
            responseClient(res, 200, 1, '用户不存在');
          }
        })
        .catch(error => {
          console.error('error :', error);
          responseClient(res);
        });
    })
    .catch(error2 => {
      console.error('error2 :', error2);
      responseClient(res);
    });
};

// 管理一级评论
exports.changeComment = (req, res) => {
  // if (!req.session.userInfo) {
  // 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
  // 	return;
  // }
  let { id, state } = req.body;
  Comment.updateOne(
    { _id: id },
    {
      state: Number(state),
      is_handle: 1,
    },
  )
    .then(result => {
      responseClient(res, 200, 0, '操作成功', result);
    })
    .catch(err => {
      console.error('err:', err);
      responseClient(res);
    });
};

// 管理第三者评论
exports.changeThirdComment = (req, res) => {
  // if (!req.session.userInfo) {
  // 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
  // 	return;
  // }
  let { id, state, index } = req.body;
  Comment.findById({
    _id: id,
  })
    .then(commentResult => {
      let i = index ? Number(index) : 0;
      if (commentResult.other_comments.length) {
        commentResult.other_comments[i].state = Number(state);
        Comment.updateOne(
          { _id: id },
          {
            other_comments: commentResult.other_comments,
            is_handle: 1,
          },
        )
          .then(result => {
            responseClient(res, 200, 0, '操作成功', result);
          })
          .catch(err1 => {
            console.error('err1:', err1);
            responseClient(res);
          });
      } else {
        responseClient(res, 200, 1, '第三方评论不存在！', result);
      }
    })
    .catch(error2 => {
      console.log('error2 :', error2);
      responseClient(res);
    });
};
