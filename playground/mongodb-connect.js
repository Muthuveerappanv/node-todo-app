const mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var url = "mongodb://localhost:27017";

MongoClient.connect(url, function (err, client) {
    if (err) {
        return console.log(`Unable to connect to Mongo ${err}`);
    }
    const db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     text: 'Something to Do',
    //     completed: false
    // }, (err, res) => {
    //     if(err) {
    //         return console.log('Unable to insert '+err);
    //     } 
    //     console.log(JSON.stringify(res.ops));
    // })

    db.collection('Users').insertOne({
        name: 'Muthu',
        age: 26,
        location: 'Bloomfield'
    }, (err, res) => {
        if (err) {
            return console.log(`Error while inserting ${err}`);
        }
        console.log(res.ops[0]._id.getTimestamp());
    });
    client.close();
});