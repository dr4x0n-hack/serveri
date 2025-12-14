const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// O'rnatilgan admin hisobi (faqat namuna, aslida DB dan olish kerak)
const adminUser = {
  id: 1,
  username: 'admin',
  passwordHash: bcrypt.hashSync('admin', 10) // Hashlangan parol
};

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === adminUser.username && bcrypt.compareSync(password, adminUser.passwordHash)) {
    const token = jwt.sign({ id: adminUser.id, role: 'admin' }, 'your_secret_key', { expiresIn: '1h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Login yoki parol xato' });
});

// Himoyalangan route
app.get('/admin/data', verifyToken, (req, res) => {
  res.json({ message: 'Maxfiy ma\'lumotlar', user: req.user });
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token kerak');
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) return res.status(500).send('Token yaroqsiz');
    req.user = decoded;
    next();
  });
}

app.listen(5000, () => console.log('Server 5000-portda ishlamoqda'));
