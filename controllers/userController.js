const User = require('../models/userModel');

exports.getAllUsers = (callback) => {
    User.getAllUsers((users) => {
        callback(null, users);
    });
};

exports.getUserById = (req, res) => {
    const userId = req.params.id;
    User.getUserById(userId, (user) => {
        res.render('edit', { user });
    });
};

// Exibir usuário antes de deletar
exports.getDeleteByUser = (req, res) => {
    const userId = req.params.id;
    User.getUserById(userId, (user) => {
        res.render('dell', { user });
    });
};

exports.addUser = (req, res) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        fone: req.body.fone,
        endereco: req.body.endereco,
    };

    User.addUser(newUser, () => {
        res.redirect('/');
    });
};

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        fone: req.body.fone,
        endereco: req.body.endereco,
    };

    User.updateUser(userId, updatedUser, () => {
        res.redirect('/');
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    User.deleteUser(userId, () => {
        res.redirect('/');
    });
};