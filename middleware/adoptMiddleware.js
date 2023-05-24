
const User = require('../models/user');
require('dotenv').config()
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;


async function userAddAdopt(req, res, next){
    const {petId} = req.params;
    try{
        const user = await User.updateOne(
            { email: `${req.decodedToken.email}` },
            { $push: { adoptedPets: petId } },
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

async function userSubtractAdopt(req, res, next){
    const {petId} = req.params;
    try{
        const user = await User.updateOne(
            { email: `${req.decodedToken.email}` },
            { $pull: { adoptedPets: petId } }
            
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


module.exports = {userAddAdopt, userSubtractAdopt}