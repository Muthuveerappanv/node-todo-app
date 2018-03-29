const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


bcrypt.genSalt(10).then(salt => {
    bcrypt.hash('123abc!', salt).then(hash => {
        console.log(hash)
    })
})

var hashedPwd = '$2a$10$pnlo4sHzAL0ibMbo9PKzaeVUM2weDaAP0Z38Mf2S/hB9nUI6Il3JW';

bcrypt.compare('123abc!', hashedPwd).then(res => console.log(res));

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');

// console.log(token);

// jwt.verify(token, '123abc');

// console.log(jwt.verify(token, '123abc'));

//console.log(SHA256('Muthu').toString());

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somestring').toString()
// }

//token.data.id = 5;
//token.data.hash = SHA256(JSON.stringify(data) + 'somestring').toString()

// var calculatedhas = SHA256(JSON.stringify(token.data) + 'somestring').toString();

// console.log(token.hash === calculatedhas);