const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET;
const tasks = [{id: 1, title: 'Sample Task', description: 'This is a sample task', username: 'testuser'}];
// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    }
);}

app.post('/tasks', authenticateToken, (req, res) => {
    const { title, description } = req.body;
    const task = { id: tasks.length + 1, title, description, username: req.user.username };
    tasks.push(task);
    res.status(201).json(task);
});
app.get('/tasks', authenticateToken, (req, res) => {
    const userTasks = tasks.filter(task => task.username === req.user.username);
    res.json(userTasks);
});
app.listen(3002, () => {
    console.log('Tasks service running on port 4001');
});
module.exports = app;