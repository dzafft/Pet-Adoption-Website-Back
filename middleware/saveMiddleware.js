const User = require('../models/user');
require('dotenv').config()
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;

async function userAddSave(req, res, next){
    const {petId} = req.params;

    
    console.log(petId)
    try{
        const user = await User.updateOne(
            { email: `${req.decodedToken.email}` },
            { $push: { savedPets: petId } },
            { upsert: true }
        )

        console.log(user)

        req.user = user;
    }
    catch (err){
        console.log(err);
        res.status(400).send('Error editing user pets')
    }

   console.log('Hello')
   next()
}

async function userSubtractSave(req, res, next){
    const {petId} = req.params;
    console.log(petId)
    try{
        const user = await User.updateOne(
            { email: `${req.decodedToken.email}` },
            { $pull: { savedPets: petId } }
        )

        console.log(user)

        req.user = user;
    }
    catch (err){
        console.log(err);
        res.status(400).send('Error editing user pets')
    }

   console.log('Hello')
   next()
}

module.exports = {userAddSave, userSubtractSave}