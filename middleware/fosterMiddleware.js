const User = require('../models/user');
require('dotenv').config()
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;

async function userAddFoster(req, res, next){
    const {petId} = req.params;
    console.log(petId)
    try{
        const user = await User.updateOne(
            { email: `${req.decodedToken.email}` },
            { $push: { fosteredPets: petId } },
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

async function userSubtractFoster(req, res, next){
    const {petId} = req.params;
    console.log(petId)
    try{
        const user = await User.updateOne(
            { email: `${req.decodedToken.email}` },
            { $pull: { fosteredPets: petId } }
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

module.exports = {userAddFoster, userSubtractFoster}