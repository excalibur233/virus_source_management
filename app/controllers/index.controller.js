const Model = require('../models/index');
const constants = require('../../config/constants');
const HttpUtil = require('../utils/http.util');
const logger = require('../utils/log.util').getLogger('errLogger');

exports.index = (req, res, next) => {
// 查询列表
	const mainfunction = async () => {
		try {
			const bonusList = await Model.BonusPoint.findAll();
			// bonusList.titles = '积分设置';
			// console.log(bonusList);
			res.render('index', { data: bonusList, titles: '积分设置' });
		} catch (err) {
			console.log(err);
			next(err);
		}
	};
	mainfunction();
};

exports.save = (req, res) => {
	const httpUtil = new HttpUtil(req, res);
	// 保存数据
	const postData = req.body;
	// console.log(postData);
	/*{
		pointNum_1: '1',
		sharePointNum_1: '0',
		writerPointNum_1: '1',
		pointNum_2: '1',
		sharePointNum_2: '1',
		writerPointNum_2: '1',
		pointNum_3: '1',
		sharePointNum_3: '0',
		writerPointNum_3: '1',
		pointNum_4: '1',
		sharePointNum_4: '2',
		writerPointNum_4: '1'
	}*/
	const datas = {};

	//遍历post数据，转换成方便查找和存储的数据形式
	for (const index in postData) {
		const arr = index.split('_');

		datas[arr[1]] = datas[arr[1]] || {};

		if (arr[0] === 'pointNum') {
			datas[arr[1]].pointNum = postData[index];
		} else if(arr[0] === 'sharePointNum'){
			datas[arr[1]].sharePointNum = postData[index];
		}else{
			datas[arr[1]].writerPointNum = postData[index];
		}
	}
	// console.log(datas);

	const mainFunction = async () => {
		try {
			for (const i in datas) {
				Model.BonusPoint.update({
					pointNum: datas[i].pointNum,
					sharePointNum: datas[i].sharePointNum,
					writerPointNum: datas[i].writerPointNum,
				}, {
					where: {
					id: i,
					},
				});
			}

			httpUtil.sendJson(constants.HTTP_SUCCESS, '更新成功');

		} catch (err) {
			logger.info(err);
			httpUtil.sendJson(constants.HTTP_FAIL, '更新失败');
		}
	};

	mainFunction();
	// next();
};
