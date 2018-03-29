const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, '123abc');

console.log(token);

jwt.verify(token, '123abc');

console.log(jwt.verify(token, '123abc'));

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