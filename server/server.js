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

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    })
    todo.save().then(out => {
        res.status(200).send(out);
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id }).then(todos => {
        res.send({ todos })
    }).catch(err => res.status(400).send());
})

app.get('/todos/:id', authenticate, (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        res.status(404).send();
    }
    Todo.findOne({ _id: req.params.id, _creator: req.user._id }).then(todo => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({ todo })
    }).catch(err => res.status(400).send());
})

app.delete('/todos/:id', authenticate, async (req, res) => {
    var _id = req.params.id;
    if (!ObjectID.isValid(req.params.id)) {
        res.status(404).send();
    }
    try {
        const todo = await Todo.findOneAndRemove({ _id, _creator: req.user._id });
        if (!todo) {
            res.status(404).send();
        }
        res.status(202).send({ todo });
    } catch (err) { 
        res.status(400).send() 
    }
})


app.patch('/todos/:id', authenticate, (req, res) => {
        var _id = req.params.id;
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
        Todo.findOneAndUpdate({ _id, _creator: req.user._id }, { $set: body }, { new: true }).then(todo => {
            res.status(202).send({ todo });
        }).catch(err => {
            console.log(err);
            res.status(404).send()
        });
    })


// users

app.post('/users', async (req, res) => {
        var body = _.pick(req.body, ['email', 'password']);
        var user = new User(body);
        try {
            user = await User.create(user);
            const token = await user.generateAuthToken();
            res.header('x-auth', token).send(user);
        } catch (err) {
            res.status(400).send(err)
        }
        // User.findOne({ email: body.email }).then(user => {
        //     if (user) {
        //         res.status(404).send();
        //     }
        //     else {
        //         user.generateAuthToken().then(token => {
        //             res.header('x-auth', token).send(user);
        //         }).catch(err => res.status(400).send(err));
        //     }
        // })
    })


app.get('/users/me', authenticate, (req, res) => {
        res.send(req.user);
    })

app.post('/users/login', async (req, res) => {
        try {
            const user = await User.loginByEmail(req.body.email, req.body.password);
            const token = await user.generateAuthToken();
            res.setHeader('x-auth', token);
            res.status(200).send(user);
        } catch (error) {
            res.status(401).send();
        }
    })

app.delete('/users/logout', authenticate, async (req, res) => {
        try {
            await req.user.removeToken(req.token);
            res.send('success');
        } catch (e) {
            return res.status(400).send();
        }
    })

app.listen(process.env.PORT, () => {
        console.log(`Listening on ${process.env.PORT}`);
    })


module.exports.app = app;