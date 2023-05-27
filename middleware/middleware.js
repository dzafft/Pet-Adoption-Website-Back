const User = require('../models/user');
const Pets = require('../models/pet');

require('dotenv').config()
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const multer = require('multer');



const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
    cloud_name: 'dpo2raj4h', 
    api_key: '278828554988427', 
    api_secret: process.env.CLOUDINARY_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });
  


function verifyJWT(req, res, next){
    
    
    const token  = req.headers['authorization']?.split(' ')[1];
    
    console.log(token)
    if (token){
        console.log('token')
        try{
            console.log(token, JWT_SECRET)
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log(decoded)
            req.decodedToken = decoded;
            next()
        }
        catch(err){
            console.log(err)
            res.status(404).send({isLoggedIn: false, message: 'Failed to authenticate'})
        }
    }
    else{
        console.log('again no token')
        res.status(500).send({message: 'Incorrect token given',  isLoggedIn: false})
    }
   
}


function generateRandomId(req, res, next) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters[randomIndex];
  }

  req.randomId = randomId;
  next()
} 


async function checkAvailability(req, res, next){
  const { petId } = req.params;
  try{
    const pet = await Pets.findOne({id: `${petId}`});
    if (pet.adoptionStatus !== 'Available'){
      return res.status(404).send({message: 'Pet not available!', pet})
    }
    else{
      next()
      return
    }
  }
  catch(err){
    console.log(err);
    return res.status(500).send(err)
  }
}

async function isSavedTwice(req, res, next){
  const {petId} = req.params;
  const email = `${req.decodedToken.email}`;
  try{
    const user = await User.findOne({email: email});
    if (user.savedPets.includes(petId)){
      return res.status(404).send({message: "Pet already saved"})
    }
    next()
    return
  }
  catch (err){
    return res.status(500).send(err);
  }
}

module.exports = { verifyJWT, upload, generateRandomId, checkAvailability, isSavedTwice}


