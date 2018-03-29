const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

const { ObjectID } = require('mongodb');

var _id = '5ab9740f70e6e975dc284892';

// Todo.find({ _id }).then(todos => {
//     console.log(todos);
// }).catch(err => console.log(err));

// Todo.findById(_id).then(todo => console.log(`Todo by Id ${todo}`)).catch(err => console.log(err));

// Todo.findOne({ completed: false }).then(todo => {
//     console.log(`Todo ${todo.text}`);
// })

User.find({ _id }).then(todos => {
    if (!todos) {
        console.log('Unable to Find USer')
    }
    console.log(todos);
}).catch(error => console.log('Error'));

User.findById(_id).then(user => console.log(user)).catch(error => console.log('Error'));
