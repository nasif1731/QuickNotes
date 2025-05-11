import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());

// Route requests to services
app.use(
  '/api/auth',
  createProxyMiddleware({ target: 'http://auth-service:4000', changeOrigin: true })
);

app.use(
  '/api/notes',
  createProxyMiddleware({ target: 'http://notes-service:8000', changeOrigin: true })
);

app.use(
  '/api/public',
  createProxyMiddleware({ target: 'http://public-service:8080', changeOrigin: true })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});