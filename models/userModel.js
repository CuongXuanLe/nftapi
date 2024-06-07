const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: [true, "Please tell us your name"]
    },
    email: {
        type: 'String',
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a validate email"]
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 8,
        maxLength: 256,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm a password"],
        validate: {
            validator: function(el) {
                return el == this.password
            },
            message: "Pwd is not the same"
        }
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User;