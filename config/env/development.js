module.exports = {
  // server config
  serverConfig: {
    serverPort: 8086,
    serverHost: 'http://localhost',
    sessionSecret: 'xsm_development_secret',
  },
  // mysql config
  mysqlConfig: {
    host: '127.0.0.1',
    port: 3306,
    database: 'virus_source_app',
    username: 'root',
    password: 'root',
  },
  // redis config
  redisConfig: {
    host: '127.0.0.1',
    port: '6379',
    db: 1,
    password: 'root',
    ttl: 1800,
    logErrors: true,
  },
  // qiniu config
  qiNiuConfig: {
    accessKey: 'mrFUPeTjAbXn6eYl-K8ydEUW4EBV10Rc4DojZXbA',
    secretKey: '0q9mSTZgKQtfQEZuILfiK44LXuvrYkdpACkTFEoY',
    upHost: 'qiniu.zone.Zone_z0',
    bucket: 'wyg569983202',
    showLink: 'http://oybluf8g8.bkt.clouddn.com',
  },
};
