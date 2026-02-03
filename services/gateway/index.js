//This acts as a "Reverse Proxy" specifically for your application logic.
//Note: In Kubernetes, your NGINX Ingress Controller will route traffic to 
// this Gateway Service, and this Gateway will route to Auth/Tasks.
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Route to Auth Service
// In K8s, the target will be "http://auth-service-clusterip:3001"
app.use('/auth', createProxyMiddleware({ 
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001', 
    changeOrigin: true,
    pathRewrite: {
        '^/gateway/auth': '/auth' // Strip gateway prefix if necessary
    }
}));
// Route to Tasks Service
app.use('/tasks', createProxyMiddleware({ 
    target: process.env.TASKS_SERVICE_URL || 'http://localhost:3002', 
    changeOrigin: true 
}));
app.listen(3000, () => {
    console.log('Gateway service running on port 3000');
});