const { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err)
        return console.log(err);

    var db = client.db('TodoApp');

    // find and update

    // db.collection('Todos').findOneAndUpdate({ _id: new ObjectID('5ab926734f5f54445450ee45') }, { $set: { completed: true } }, {returnNewDocument: true}).then(result => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({ name: 'Athira' }, { $inc: { age: -102.5 } }, {returnOriginal: false}).then(result => {
        console.log(result);
    });

    client.close();
});