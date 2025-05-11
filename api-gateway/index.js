const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/auth': '' }
}));

app.use('/notes', createProxyMiddleware({
  target: process.env.NOTES_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/notes': '' }
}));

app.use('/public', createProxyMiddleware({
  target: process.env.PUBLIC_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/public': '' }
}));

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});
