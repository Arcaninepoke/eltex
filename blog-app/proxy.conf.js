module.exports = {
  '/api' : {
    'target' : 'http://localhost:3000',
    'secure' : false,
    'changeOrigin' : true,
    'pathRewrite' : {'^/api' : ''}
  },
  '/update' : {
    'target' : 'http://localhost:3000',
    'secure' : false,
    'changeOrigin' : true
  },
  '/graphql' : {
    'target' : 'http://localhost:3000',
    'secure' : false,
    'changeOrigin' : true
  }
};