const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const logUtil = require('../app/utils/log.util');
const ueditor = require("ueditor");
var qn = require('qn');

// local require
const config = require('./config');

module.exports = function () {
  const app = express();

  // view engine setup.
  app.set('views', path.join(__dirname, '../app/views'));
  app.set('view options', {debug:true});
  app.set('view engine', 'pug');

  // use log4js
  app.use(logUtil.getLog4Js().connectLogger(logUtil.getLogger('normal'), { level: 'INFO', format: ':method :url' }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.serverConfig.sessionSecret,
  }));
  // app.use(csurf({ cookie: true }));

  // always last, but before user middleware.
  app.use(express.static(path.join(__dirname, '../public/')));

  //ueditor图片上传
  app.use("/ueditor/ue", ueditor('', function (req, res, next) { 
    let client = qn.create(config.qiNiuConfig); 
    
    // ueditor 客户发起上传图片请求  
    if (req.query.action === 'uploadimage') {  
        var foo = req.ueditor.file;  //文件内容
        //console.log(req);
        //var fileFormat = (req.ueditor.filename).split("."); 
        var imgname = req.ueditor.filename ;  
  
        var file_path = '/images/ueditor/' +Date.now() + imgname;
        // res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做  
        // res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开  
    }  
    //  客户端发起图片列表请求  
    /*else if (req.query.action === 'listimage') {  
        var dir_url = '/images/ueditor/';  
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片  
    }  */
    else if (req.query.action === 'uploadvideo'){
        var foo = req.ueditor.file;  //文件内容
        console.log(foo);
        var file_path = '/videos/ueditor/' +Date.now() + req.ueditor.filename;
    }
    // 客户端发起其它请求  
    else {  
        // console.log('config.json')  
        res.setHeader('Content-Type', 'application/json');  
        res.redirect('/ueditor/php/config.json');  
        return ;
    }  
   client.upload(foo, {
              key: file_path
          }, function (err, results) {
            if (err) throw err;
            res.json({
              'url': file_path,
              //'title': req.body.pictitle,
              'original': file_path,
              'state': 'SUCCESS'
            });
    });
  }));  

  // register user routes here.
  require('../app/routes/auth.route')(app);
  require('../app/routes/index.route')(app);
  require('../app/routes/news.route')(app);

  // catch the 404 and render the 404 page.
  app.use((req, res) => {
    res.status(404);
    res.render('404');
  });

  // error handler,
  // eslint-disable-next-line no-unused-vars.
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.log(err);
    res.render('500', { error: err.toString() });
  });

  return app;
};
