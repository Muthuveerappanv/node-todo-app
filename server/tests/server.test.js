const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { ObjectID } = require('mongodb');

const todos = [{ _id: new ObjectID(), text: 'test todos1' }, { _id: new ObjectID(), text: 'test todos2' }];

beforeEach((done) => {
    Todo.remove().then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

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