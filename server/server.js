const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { ObjectID } = require('mongodb');

const port = process.env.PORT || 3000;

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

app.listen(port, () => {
    console.log(`Listening on ${port}`);
})

module.exports.app = app;