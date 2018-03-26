const { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err)
        return console.log(err);

    var db = client.db('TodoApp');

    // delete many

    db.collection('Users').deleteMany({name:'Muthu'}).then(res => {
        console.log(res.deletedCount);
    }).catch(error => {
        console.log(`Error ${error}`)
    });

    // delete one

    db.collection('Todos').deleteOne({completed: true}).then(res => {
        console.log(res.deletedCount);
    }).catch(error => {
        console.log(`Error ${error}`)
    });

    // find one and delete

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5ab592e460b2f30f90574958")}).then(res => {
        console.log(res);
    }).catch(error => {
        console.log(`Error ${error}`)
    });

    client.close();
})