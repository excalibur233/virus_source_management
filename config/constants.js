const constants = {
	// redis_data前缀
	REDIS_PREFIX: 'med',

	// api const
	HTTP_FAIL: 500,
	HTTP_SUCCESS: 200,

	// 新闻列表的分页显示数量
	NEWS_PAGE_LIMIT: 25,

	// 资讯搜索类型 热门
	HOT_NEWS: 1,
	// 资讯搜索类型 最新
	LATEST_NEWS: 2,

	// 资讯内容类型 默认为无类别
	CONTEXT_TOTAL: 0,

	// 资讯类型 普通新闻
	TYPE_NEWS: 1,
	// 资讯类型 自测题
	TYPE_ESTIMATE: 2,

	// 资讯分类id对应列表   目前写死
	NEWS_CLASS_LIST: {
		0: '全部', 1: '痛风', 2: '糖尿病', 3: '甲状腺', 4: '自测题',
	},

};

module.exports = constants;
