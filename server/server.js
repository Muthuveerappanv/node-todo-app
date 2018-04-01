require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { ObjectID } = require('mongodb');
const { authenticate } = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then(out => {
        res.status(200).send(out);
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({ todos })
    }).catch(err => res.status(400).send());
})

app.get('/todos/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        res.status(404).send();
    }
    Todo.findById(req.params.id).then(todo => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({ todo })
    }).catch(err => res.status(400).send());
})

app.delete('/todos/:id', (req, res) => {
    var _id = req.params.id;
    if (!ObjectID.isValid(req.params.id)) {
        res.status(404).send();
    }
    Todo.findByIdAndRemove(_id).then(todo => {
        if (!todo) {
            res.status(404).send();
        }
        res.status(202).send({ todo });
    }).catch(err => res.status(400).send());
})

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(req.params.id)) {
        res.status(404).send();
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date();
    } else {
        body.completedAt = null;
        body.completed = false;
    }
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then(todo => {
        res.status(202).send({ todo });
    }).catch(err => res.status(404).send());
})


// users

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    // User.create(user).then((user) => {
    //     return user.generateAuthToken();
    // }).then((token) => {
    //     res.header('x-auth', token).send(user);
    // }).catch(err => res.status(400).send(err));
    user.generateAuthToken().then(token => {
        res.header('x-auth', token).send(user);
    }).catch(err => res.status(400).send(err));
})


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

app.post('/users/login', (req, res) => {
    User.loginByEmail(req.body.email, req.body.password).then(user => {
        user.generateAuthToken().then((token) => {
            res.setHeader('x-auth', token);
            res.status(200).send(user);
        })

    }).catch(error => {
        res.status(401).send();
    });
})

app.delete('/users/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.send('success');
    }).catch(err => {
        return res.send(400);
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
})

module.exports.app = app;