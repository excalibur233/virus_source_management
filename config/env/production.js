module.exports = {
	// production configuration options
	serverConfig:{
		serverPort: 8081,
		serverHost: 'http://share-management.medsci-tech.com',
		sessionSecret: 'xsm_production_secret',
	},

	// mysql config
	mysqlConfig: {
		host: 'rm-2ze62b8v9ox9m35k7o.mysql.rds.aliyuncs.com',
		port: 3306,
		database: 'virus_source',
		username: 'virus_source',
		password: 'virus_source_123$%^',
	},

	// redis config
	redisConfig: {
		host: 'r-2zebafe77a6fd114.redis.rds.aliyuncs.com',
		port: '6379',
		password: 'xuLU5900',
		ttl: 1800,
		logErrors: true,
	},

	// qiniu config
	qiNiuConfig: {
		accessKey: 'unt5w-mSHycfoT9XPuonMFj49mu1XOcEs4pBO4vg',
		secretKey: '1Leh1VrCAXFutyg4hzSZ2vSPyNTeESrexYdc1S-H',
		upHost: 'qiniu.zone.Zone_z0',
		bucket: 'med-share',
		showLink: 'http://p025heou9.bkt.clouddn.com',
	},

	wxConfig:{
		AppID:'wx0ad6f23cad3621f8',
		AppSecret:'0ab4b826da07608e4b54299af36c23c0'
	}
};
