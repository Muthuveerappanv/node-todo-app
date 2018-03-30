const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

var userOneObjId = new ObjectID();
var userTwoObjId = new ObjectID();

const users = [{
    _id: userOneObjId,
    email: 'muthu@gmail.com',
    password: '123abc',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneObjId.toHexString(), access: 'auth' }, 'abc123').toString()
    }]
},
{
    _id: userTwoObjId,
    email: 'usertwo@gmail.com',
    password: '112344nn',
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}


const todos = [{ _id: new ObjectID(), text: 'test todos1' }, { _id: new ObjectID(), text: 'test todos2' }];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
}

module.exports = { todos, populateTodos, users, populateUsers };

