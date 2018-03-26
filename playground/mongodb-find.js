const { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err)
        return console.log(err);

    var db = client.db('TodoApp');

    db.collection('Todos').find({_id: new ObjectID('5ab576137bba800e64885933')}).toArray().then((res) => {
        console.log(JSON.stringify(res, undefined, 2));
    }).catch(error => {
        console.log(`Error ${error}`)
    });

    db.collection('Todos').find().count().then((res) => {
        console.log(res);
    }).catch(error => {
        console.log(`Error ${error}`)
    });

    db.collection('Users').find({name: 'Athira'}).toArray().then((res) => {
        console.log(JSON.stringify(res, undefined, 2));
    });

    client.close();
})