const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const PORT = process.env.PORT || 3000;

app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  changeOrigin: true,
}));

app.use('/tasks', createProxyMiddleware({
  target: process.env.TASKS_SERVICE_URL || 'http://tasks-service:3002',
  changeOrigin: true,
}));

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway', uptime: process.uptime() });
});

app.listen(PORT, () => console.log(`Gateway running on ${PORT}`));