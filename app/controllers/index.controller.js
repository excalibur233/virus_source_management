const Model = require('../models/index');
const constants = require('../../config/constants');
const HttpUtil = require('../utils/http.util');

exports.index = (req, res, next) => {
	//查询列表
	const mainfunction = async()=>{
		try{
			const bonusList = await Model.BonusPoint.findAll();
			//bonusList.titles = '积分设置';
			//console.log(bonusList);
			res.render('index',{data:bonusList,titles:'积分设置'});
		}catch(err){
			console.log(err);
			next(err);
		};
	
	}
	mainfunction();
	
};

exports.save = (req,res,next)=>{
	const httpUtil = new HttpUtil(req, res);
	//保存数据
	var postData = req.body;
	//console.log(postData);
	const datas = {};
	for(let index in postData){
		let arr = index.split('_');

		datas[arr[1]] = datas[arr[1]] || {};
		if(arr[0] == 'pointNum'){
			datas[arr[1]].pointNum =  postData[index];
		}else{
			datas[arr[1]].otherPointNum =  postData[index];
		}
	}
	console.log(datas);
	
	const mainFunction = async()=>{
		try{
			for(let i in datas){
				await Model.BonusPoint.update({
					pointNum:datas[i].pointNum,
					otherPointNum:datas[i].otherPointNum
				},{
					where:{
						id:i
					}
				})
			}
			httpUtil.sendJson(constants.HTTP_SUCCESS, '更新成功');
		}catch(err){
			logger.info(err);
			httpUtil.sendJson(constants.HTTP_FAIL, '更新失败');
		}
		
	}
	mainFunction();
	//next();
}
