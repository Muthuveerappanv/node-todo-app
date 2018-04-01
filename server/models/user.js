const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: new ObjectID()
    },
    email: {
        required: true,
        trim: true,
        minlength: 3,
        type: String,
        lowercase: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '${VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
    user.tokens.push({ access, token });
    return user.save().then(() => {
        return token;
    })
}


UserSchema.methods.toJSON = function () {
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['_id', 'email']);
}

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.statics.loginByEmail = function (email, password) {
    return User.findOne({ email }).then(user => {
        if (!user) {
            return Promise.reject();
        }
        // return new Promise((resolve, reject) => {
        //     bcrypt.compare(password, user.password).then(res => {
        //         if (res) {
        //             return resolve(user);
        //         } else {
        //             return reject();
        //         }
        //     }).catch(err => {
        //         return reject();
        //     })
        // }) 
        return bcrypt.compare(password, user.password).then(res => {
            if (res) {
                return Promise.resolve(user);
            } else {
                return Promise.reject();
            }
        }).catch(err => {
            return Promise.reject()
        });
    })
}

UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
}

UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10).then(salt => {
            bcrypt.hash(user.password, salt).then(hashedpwd => {
                user.password = hashedpwd;
                next();
            })
        });
    } else {
        next();
    }
})

var User = mongoose.model('user', UserSchema);

module.exports = { User };