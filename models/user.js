const mongoose = require('mongoose');


const newSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    adoptedPets:{
        type: Object,
        required: true
    },
    fosteredPets:{
        type: Object,
        required: true
    },
    savedPets:{
        type: Object,
        required: true
    },
    bio:{
        type: String
    },
    isAdmin:{
        type: Boolean,
        required:true
    }
})

const User = mongoose.model('user', newSchema, 'collections');

module.exports = User;
