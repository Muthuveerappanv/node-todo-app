const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

beforeEach((done) => {
    Todo.remove().then(() => done());
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
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text === text);
                    done();
                }).catch(err => done(err));
            });
    })

    it('Should test /todos for bad request', (done) => {
        request(app)
            .post('/todos')
            .send({ })
            .expect(400)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return err;
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch(err => done(err));
            });
    })
});