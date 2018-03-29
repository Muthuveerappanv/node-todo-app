const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/User');
const { ObjectID } = require('mongodb');

const port = 3000 || process.env.PORT;

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

app.listen(port, () => {
    console.log(`Listening on ${port}`);
})

module.exports.app = app;