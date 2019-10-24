![项目结构图](https://upload-images.jianshu.io/upload_images/12890819-3348be07c69aa2b9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 前言

blog-node 是采用了主流的前后端分离思想的，主里只讲 后端。

效果请看 [https://biaochenxuying.cn](https://biaochenxuying.cn)

项目详情请看这篇文章：
[基于 node + express + mongodb 的 blog-node 项目文档说明](https://biaochenxuying.cn/articleDetail?article_id=5bf8c57185e0f13af26e7d0d)

## 已经实现功能

- [x] 登录
- [x] 文章管理
- [x] 标签管理
- [x] 评论
- [x] 留言管理
- [x] 用户管理
- [x] 友情链接管理
- [x] 时间轴管理
- [x] 身份验证
- [x] 项目展示
- [x] 第三方 github 授权登录
- [x] 文章归档

## 待实现功能

- [ ] 个人中心（用来设置博主的各种信息）
- [ ] 工作台（ 接入百度统计接口，查看网站浏览量和用户访问等数据 ）

## 技术

- node
- cookie-parser : "~1.4.3"
- crypto : "^1.0.1"
- express: "~4.16.0"
- express-session : "^1.15.6",
- http-errors : "~1.6.2",
- mongodb : "^3.1.8",
- mongoose : "^5.3.7",
- mongoose-auto-increment : "^5.0.1",
- yargs : "^12.0.2"

## 注意点

- 文章是分类型的：文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍；而且简历和管理员介绍的文章只能是各自一篇（因为前台展示那里有个导航 关于我 ，就是请求管理员介绍这篇文章的，简历也是打算这样子用的），普通文章可以是无数篇。
- 点赞的用户 like_users 那里应该只保存用户 id 的，这个后面修改一下。
- 评论功能是实现了简单的三级评论的，第三者的评论（就是别人对一级评论进行再评论）放在 other_comments 里面。
- 评论是有状态的：状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论。
- 管理一级和三级评论是设置前台能不能展示的，默认是展示，如果管理员看了，是条垃圾评论就 设置为 -1 或者 -2 ，进行隐藏，前台就不会展现了。

## Build Setup ( 构建安装 )

```
# install dependencies
npm install

# serve with hot reload at localhost: 3000
npm start

# build for production with minification
请使用 pm2 ，可以永久运行在服务器上，且不会一报错 node 程序就挂了。
```

## 项目常见问题


### 管理后台登录

管理后台登录是用 **邮箱加密码** 进行登录


### 管理员账号创建

![](https://upload-images.jianshu.io/upload_images/12890819-67861a912768e646.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

管理后台的登录账号并不是 admin/user ，也不是搭建 mongodb 数据库时创建的 user 用户，这里的账号和密码要自己创建，至于怎样创建呢？

#### 用 postman 调接口注册

如果是本地的可以像这样子创建，如果是服务器上的，请把 url 修改一下，

![注册](https://upload-images.jianshu.io/upload_images/12890819-3772744f72b8ed3e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 1.  url

```
http://127.0.0.1:3000/register
```

- 2. param

```
{
 "name": "BiaoChenXuYing",
 "password": "888888",
 "email": "admin@qq.com",
 "phone": 1380013800,
 "type": 0,
 "introduce":"加班到天明，学习到昏厥!!! 微信公众号：【 BiaoChenXuYing 】，分享 WEB 全栈开发等相关的技术文章，热点资源，全栈程序员的成长之路。"
}
```

这里的 type 为 0 是管理员账号，为 1 时，是普通用户。

## 项目地址与文档教程

**项目地址：**

> [前台展示: https://github.com/biaochenxuying/blog-react](https://github.com/biaochenxuying/blog-react)

> [前台展示: https://github.com/biaochenxuying/blog-vue-typescript](https://github.com/biaochenxuying/blog-vue-typescript)

> [管理后台：https://github.com/biaochenxuying/blog-react-admin](https://github.com/biaochenxuying/blog-react-admin)

> [后端：https://github.com/biaochenxuying/blog-node](https://github.com/biaochenxuying/blog-node)

> [blog：https://github.com/biaochenxuying/blog](https://github.com/biaochenxuying/blog)

**本博客系统的系列文章：**

- 1. [react + node + express + ant + mongodb 的简洁兼时尚的博客网站](https://biaochenxuying.cn/articleDetail?article_id=5bf57a8f85e0f13af26e579b)
- 2. [react + Ant Design + 支持 markdown 的 blog-react 项目文档说明](https://biaochenxuying.cn/articleDetail?article_id=5bf6bb5e85e0f13af26e57b7)
- 3. [基于 node + express + mongodb 的 blog-node 项目文档说明](https://biaochenxuying.cn/articleDetail?article_id=5bf8c57185e0f13af26e7d0d)
- 4. [服务器小白的我,是如何将 node+mongodb 项目部署在服务器上并进行性能优化的](https://biaochenxuying.cn/articleDetail?article_id=5bfa728bb54f044b4f9da240)
- 5. [github 授权登录教程与如何设计第三方授权登录的用户表](https://biaochenxuying.cn/articleDetail?article_id=5c7bd34e42b55e2ecc90976d)
- 6. [一次网站的性能优化之路 -- 天下武功，唯快不破](https://biaochenxuying.cn/articleDetail?article_id=5c8ca2d3b87b8a04f1860c9a)
- 7. [Vue + TypeScript + Element 搭建简洁时尚的博客网站及踩坑记](https://biaochenxuying.cn/articleDetail?article_id=5c9d8ce5f181945ddd6b0ffc)
- 8. [前端解决第三方图片防盗链的办法 - html referrer 访问图片资源403问题](https://biaochenxuying.cn/articleDetail?article_id=5cfcc6798090bd3c84138a08)


## 最后

如果您觉得本项目和文章不错或者对你有所帮助，请给个星吧，你的肯定就是我继续创作的最大动力。


