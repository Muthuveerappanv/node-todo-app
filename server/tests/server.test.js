const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { ObjectID } = require('mongodb');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('Should test /todos response', (done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            }).end((err, res) => {
                if (err) return err;
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text === text);
                    done();
                }).catch(err => done(err));
            });
    })

    it('Should test /todos for bad request', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return err;
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
            });
    })
});

describe('GET /todos', () => {
    it('Should test Get /todos response', (done) => {
        var text = 'Test todo text';
        request(app)
            .get('/todos')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.todos[0].text).toEqual(todos[0].text);
            })
            .end(done);
    })
});

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        var id = todos[0]._id;
        request(app)
            .get(`/todos/${id.toString()}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.todo.text).toEqual(todos[0].text);
            })
            .end(done);
    })

    it('Should return a 404 if incorrect objectId passed', (done) => {
        request(app)
            .get('/todos/1')
            .expect(404)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    })

    it('Should return a 404 if no todo found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID()}`)
            .expect(404)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    })
});


describe('Delete /todos/:id', () => {
    it('Should return todo doc after successfully deleting', (done) => {
        var id = todos[0]._id;
        request(app)
            .delete(`/todos/${id.toString()}`)
            .expect(202)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.todo.text).toEqual(todos[0].text);
            }).end((err, res) => {
                if (err) return err;
                Todo.findById(id).then(todo => {
                    expect(todo).toBeNull();
                    done();
                })
            });
    })

    it('Should return a 404 if incorrect objectId passed', (done) => {
        request(app)
            .delete('/todos/1')
            .expect(404)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    })

    it('Should return a 404 if no todo found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    })
});


describe('Patch /todos/:id', () => {
    it('Should return todo doc after successfully deleting', (done) => {
        var id = todos[0]._id;
        var patchinput = { 'text': 'testing patch', 'completed': true };
        request(app)
            .patch(`/todos/${id.toString()}`)
            .send(patchinput)
            .expect(202)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.todo.text).toEqual(patchinput.text);
            }).end((err, res) => {
                if (err) return err;
                Todo.findById(id).then(todo => {
                    expect(todo.text).toEqual(patchinput.text);
                    expect(todo.completed).toEqual(true);
                    expect(todo.completedAt instanceof Date);
                    done();
                })
            });
    })
});

// users test

describe('GET  /users/me', () => {
    it('Should validate user token', (done) => {
        request(app)
            .get(`/users/me`)
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(200)
            .expect(res => {
                expect(res.body.email).toEqual(users[0].email);
            }).end(done);
    })

    it('Should return 401 when user with invalid token passed', (done) => {
        request(app)
            .get(`/users/me`)
            .set('x-auth', '')
            .send()
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            }).end(done);
    })
});


describe('POST  /users', () => {
    it('Should validate user token', (done) => {
        var password = 'pass1234';
        var email = 'test@test.com';
        request(app)
            .post(`/users`)
            .send({ email, password })
            .expect(200)
            .expect(res => {
                expect(res.body.email).toEqual(email);
            }).end((err, res) => {
                if (err) return done(err);
                User.findOne({ email }).then(user => {
                    expect(user.email).toEqual(email);
                    expect(user.password).not.toBe(password);
                    done();
                })
            });
    })

    it('Should return 400 when user with invalid email passed', (done) => {
        var password = 'pass1234';
        var email = 'test.com';
        request(app)
            .post(`/users`)
            .send({ email, password })
            .expect(400)
            .end(done);
    })


    it('Should return 400 when user duplicate email passed', (done) => {
        var password = 'pass1234';
        var email = 'usertwo@gmail.com';
        request(app)
            .post(`/users`)
            .send({ email, password })
            .expect(400)
            .end(done);
    })
});



describe('POST  /users/login', () => {
    it('Should validate user token', (done) => {
        var password = users[0].password;
        var email = users[0].email;
        request(app)
            .post(`/users/login`)
            .send({ email, password })
            .expect(200)
            .expect(res => {
                expect(res.body.email).toEqual(email);
            }).end((err, res) => {
                if (err) return done(err);
                User.findOne({ email }).then(user => {
                    expect(user.email).toEqual(email);
                    expect(user.password).not.toBe(password);
                    done();
                })
            });
    })

    it('Should return 400 when user with invalid email passed', (done) => {
        var password = 'pass1234';
        var email = 'test.com';
        request(app)
            .post(`/users/login`)
            .send({ email, password })
            .expect(401)
            .end(done);
    })


    // it('Should return 400 when user duplicate email passed', (done) => {
    //     var password = 'pass1234';
    //     var email = 'usertwo@gmail.com';
    //     request(app)
    //         .post(`/users`)
    //         .send({ email, password })
    //         .expect(400)
    //         .end(done);
    // })
});