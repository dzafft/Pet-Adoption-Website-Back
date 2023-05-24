const mongoose = require('mongoose');


const newSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    adoptionStatus: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    hypoallergnic: {
        type: Boolean,
        required: true
    },
    dietery: {
        type: Object,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    
})




const Pets = mongoose.model('pets', newSchema, 'Pets');


module.exports = Pets;
