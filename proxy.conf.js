console.info('Angular proxy is pointing to api to port 3000 ')

module.exports = {
  '/api': {
    target: 'http://localhost:3000',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    pathRewrite: {
      '/api/': '/',
    },
  },
}
