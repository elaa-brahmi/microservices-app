const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = process.env.PORT_AUTH_SERVICE || 3001;

app.use(express.json());
const users = [];
const SECRET_KEY = process.env.JWT_SECRET;

app.post('/register', async(req,res)=>{
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({username, password: hashedPassword});
    res.status(201).send('User registered');
});
app.post('/login', async(req,res)=>{
    const {username, password} = req.body;
    const user = users.find(u => u.username === username);
    if(user && await bcrypt.compare(password, user.password)){
        const token = jwt.sign({username}, SECRET_KEY, {expiresIn: '1h'});
        res.json({token});
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Health endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'auth-service', uptime: process.uptime() });
});

app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});