const express = require('express');
const session = require('express-session');
const path = require('path');
const userController = require('./controllers/userController');
const app = express();
const PORT = process.env.PORT || 3001;

const users = [
    {
        id: 1,
        username: 'admin',
        password: 'Senaidaora', 
        role: 'admin'
    },
    {
        id: 2,
        username: 'aluno',
        password: 'Senai1234',
        role: 'aluno'
    }
];


app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(session({
    secret: 'chaveSuperSecretaParaLogin',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000, // 1 hora
        httpOnly: true,
        secure: false
    }
}));


app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function requireLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function requireAdmin(req, res, next) {
    if (req.session.role === 'admin') {
        return next();
    } else {
        res.status(403).send('Acesso negado. Somente administradores.');
    }
}

app.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.render('login', { error: 'Usuário não encontrado' });
    }

    if (user.password !== password) {
        return res.render('login', { error: 'Senha incorreta' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role; 
    res.redirect('/');
});

app.get('/', requireLogin, (req, res) => {
    userController.getAllUsers((err, users) => {
        if (err) {
            return res.status(500).send('Erro ao carregar usuários');
        }
        res.render('index', {
            users,
            role: req.session.role || 'aluno' 
        });
    });
});

app.get('/add', requireAdmin, (req, res) => {
    res.render('add');
});

app.post('/add', requireAdmin, userController.addUser);

app.get('/edit/:id', requireAdmin, userController.getUserById);

app.post('/edit/:id', requireAdmin, userController.updateUser);

app.get('/dell/:id', requireAdmin, userController.getDeleteByUser);

app.post('/dell/:id', requireAdmin, userController.deleteUser);

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao destruir a sessão:', err);
            return res.status(500).send('Erro ao fazer logout');
        }
        res.redirect('/login');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});