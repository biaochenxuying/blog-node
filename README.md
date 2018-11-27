
![项目结构图](https://upload-images.jianshu.io/upload_images/12890819-3348be07c69aa2b9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 前言

blog-node 是采用了主流的前后端分离思想的，主里只讲 后端。

效果请看 [http://biaochenxuying.cn/main.html](http://biaochenxuying.cn/main.html)

项目详情请看这篇文章：
[基于 node + express + mongodb 的 blog-node 项目文档说明](http://biaochenxuying.cn/articleDetail?article_id=5bf8c57185e0f13af26e7d0d)

# 1. 后端

## 1.1 已经实现功能

- [x] 登录  
- [x] 文章管理
- [x] 标签管理 
- [x] 评论  
- [x] 留言管理
- [x] 用户管理
- [x] 友情链接管理
- [x] 时间轴管理
- [x] 身份验证

## 1.2 待实现功能

- [ ] 点赞、留言和评论 的通知管理
- [ ] 个人中心（用来设置博主的各种信息）
- [ ] 工作台（ 接入百度统计接口，查看网站浏览量和用户访问等数据 ）

# 2. 技术

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


## 3. 注意点

- 文章是分类型的：文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍；而且简历和管理员介绍的文章只能是各自一篇（因为前台展示那里有个导航 关于我 ，就是请求管理员介绍这篇文章的，简历也是打算这样子用的），普通文章可以是无数篇。
- 点赞的用户 like_users 那里应该只保存用户 id 的，这个后面修改一下。
- 评论功能是实现了简单的三级评论的，第三者的评论（就是别人对一级评论进行再评论）放在 other_comments 里面。
- 评论是有状态的：状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论。
- 管理一级和三级评论是设置前台能不能展示的，默认是展示，如果管理员看了，是条垃圾评论就 设置为 -1 或者 -2 ，进行隐藏，前台就不会展现了。

# 7. Build Setup ( 构建安装 )

``` 
# install dependencies
npm install 

# serve with hot reload at localhost: 3000
npm start 

# build for production with minification
请使用 pm2 ，可以永久运行在服务器上，且不会一报错 node 程序就挂了。
```

# 8. 项目地址

**项目地址：**
> [前台展示: https://github.com/biaochenxuying/blog-react](https://github.com/biaochenxuying/blog-react)

> [管理后台：https://github.com/biaochenxuying/blog-react-admin](https://github.com/biaochenxuying/blog-react-admin)

> [后端：https://github.com/biaochenxuying/blog-node](https://github.com/biaochenxuying/blog-node)

> [blog：https://github.com/biaochenxuying/blog](https://github.com/biaochenxuying/blog)

**本博客系统的系列文章：**

- 1. [react + node + express + ant + mongodb 的简洁兼时尚的博客网站](http://biaochenxuying.cn/articleDetail?article_id=5bf57a8f85e0f13af26e579b)
- 2. [react + Ant Design + 支持 markdown 的 blog-react 项目文档说明](http://biaochenxuying.cn/articleDetail?article_id=5bf6bb5e85e0f13af26e57b7)
- 3. [基于 node + express + mongodb 的 blog-node 项目文档说明](http://biaochenxuying.cn/articleDetail?article_id=5bf8c57185e0f13af26e7d0d)
- 4. [服务器小白的我,是如何将node+mongodb项目部署在服务器上并进行性能优化的](http://biaochenxuying.cn/articleDetail?article_id=5bfa728bb54f044b4f9da240)



# 9. 参考

小汪也是第一次搭建 node 后端项目，也参考了其他项目。

参考项目：
[1. nodepress](https://github.com/surmon-china/nodepress)
[2. React-Express-Blog-Demo](https://github.com/Nealyang/React-Express-Blog-Demo)


# 10. 最后

鉴于问问题的人有点多，小汪时间有限，处理不过来，大家可以加入 QQ 群：**186045338**，加群暗号：**全栈修炼** ，一起相互交流学习。

对 **全栈开发** 有兴趣的朋友可以扫下方二维码关注我的公众号，我会不定期更新有价值的内容。

关注公众号并回复 **福利** 便免费送你视频资源，绝对干货。

福利详情请点击：  [免费资源分享--Python、Java、Linux、Go、node、vue、react、javaScript](https://mp.weixin.qq.com/s?__biz=MzA4MDU1MDExMg==&mid=2247483711&idx=1&sn=1ffb576159805e92fc57f5f1120fce3a&chksm=9fa3c0b0a8d449a664f36f6fdd017ac7da71b6a71c90261b06b4ea69b42359255f02d0ffe7b3&token=1560489745&lang=zh_CN#rd)

![BiaoChenXuYing](https://upload-images.jianshu.io/upload_images/12890819-091ccce387e2ea34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



