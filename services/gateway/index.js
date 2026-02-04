const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const PORT = process.env.PORT_GATEWAY || 3000;
// Health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'gateway', 
    uptime: process.uptime() 
  });
});

//For your Gateway to talk to the other services inside Kubernetes,
//  you must ensure the URLs point to the Kubernetes service names, not localhost.
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http:///auth-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // removes /auth from the start of the path
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] Routing ${req.url} to -> ${process.env.AUTH_SERVICE_URL}${proxyReq.path}`);
  }
}));

app.use('/tasks', createProxyMiddleware({
  target: process.env.TASKS_SERVICE_URL || 'http://tasks-service:3002',
  changeOrigin: true,
    pathRewrite: {
    '^/tasks': '', // removes /tasks from the start of the path
  },
    onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] Routing ${req.url} to -> ${process.env.TASKS_SERVICE_URL}${proxyReq.path}`);
  }
  
}));



app.listen(PORT, () => console.log(`Gateway running on ${PORT}`));