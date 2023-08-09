const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const petsRouter = require('./routes/pets');
const usersRouter = require('./routes/users');

require('dotenv').config()
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/user')

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
const urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json(), urlencodedParser);
const path = require('path');

app.use('/update', express.static(path.join(__dirname, 'uploads')));
const dbURI = process.env.DBURI;


mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, dbName: 'test'})
    .then( (req, res) =>{
        console.log('connected to Mongo')
    })
    .catch((err)=>{
        console.log(err)
    })


    app.get('/', (req, res) => {
    res.send("Hello");
})

app.post('/signup', async (req, res) =>{
    const user = req.body;
    const uniqueEmail = await User.findOne({email: user.email});
    if (uniqueEmail){
        res.status(404).send({message: 'This email is already in use!'})
        return 
    }
    else{
        user.password = await bcrypt.hash(req.body.password, 10)
        
    }
    const dbUser = new User({
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        number: user.phoneNumber,
        isAdmin: user.isAdmin,
        savedPets: [],
        fosteredPets: [],
        adoptedPets: []
    })
    console.log(dbUser)
    const payload ={
        id: dbUser._id,
        email: dbUser.email
    }
    const token = jwt.sign(
        payload,
        JWT_SECRET,
        {expiresIn: 86400}
    )
    dbUser.token = token;
    dbUser.save();
    return res.status(200).send({message: 'Your new account has been successfully created!', dbUser: dbUser})
})

app.post('/login', (req, res) =>{
    
    const userLoggingIn = req.body
    
    User.findOne({email: userLoggingIn.email})
    .then(dbUser =>{
        if (!dbUser){
            return res.status(404).send({message: 'Invalid information sent'})
        }
        bcrypt.compare(userLoggingIn.password, dbUser.password)
        .then(isCorrect =>{
            if (isCorrect){
                
                const payload ={
                    id: dbUser._id,
                    email: dbUser.email
                }
                jwt.sign(
                    payload,
                    JWT_SECRET,
                    {expiresIn: 86400},
                    (err, token) =>{
                        if (err) return res.send({message: err})
                        dbUser.token = token;
                        return res.send({
                            message: 'success',
                            user: dbUser})
                    }
                )
            }
            else{
                return res.status(401).send({message: 'Invalid username or password'})
            }
        })
    })
})


app.use('/users', usersRouter);
app.use('/pets', petsRouter);

app.listen(PORT, ()=>{
    console.log('We good boys')
})

module.exports = app
