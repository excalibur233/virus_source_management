module.exports = {
  // server config
  serverConfig: {
    // development configuration options
    serverPort: 9000,
    // serverHost: 'http://118.31.16.48',
    serverHost: 'http://localhost',
    // session secret key
    sessionSecret: 'xsm_production_secret',
  },
  // mysql config
  mysqlConfig: {
    host: '127.0.0.1',
    port: 3306,
    database: 'virus_source_app',
    username: 'root',
    password: 'root',
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
