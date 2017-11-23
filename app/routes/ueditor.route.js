const router = require('express').Router();
const ueditor = require("ueditor");

const prefix = '/ueditor';
router.post('/ue',function (req, res, next) {  
    // ueditor 客户发起上传图片请求  
    if (req.query.action === 'uploadimage') {  
        var foo = req.ueditor;  
  		//console.log(foo);
        var imgname = req.ueditor.filename;  
  
        var img_url = '/images/ueditor/';  
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做  
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开  
    }  
    //  客户端发起图片列表请求  
    else if (req.query.action === 'listimage') {  
        var dir_url = '/images/ueditor/';  
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片  
    }  
    // 客户端发起其它请求  
    else {  
        // console.log('config.json')  
        res.setHeader('Content-Type', 'application/json');  
        res.redirect('/ueditor/php/config.json');  
    }  
  });  

module.exports = function (app) {
  app.use(prefix, router);
};