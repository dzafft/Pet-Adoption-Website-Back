const petsRouter = require('express').Router();

const { verifyJWT, upload, isSavedTwice, generateRandomId, checkAvailability } = require('../middleware/middleware');

const { userAddAdopt } = require('../middleware/adoptMiddleware');
const { userSubtractAdopt } = require('../middleware/adoptMiddleware');

const { userAddFoster } = require('../middleware/fosterMiddleware');
const { userSubtractFoster } = require('../middleware/fosterMiddleware');

const { userAddSave } = require('../middleware/saveMiddleware');
const { userSubtractSave } = require('../middleware/saveMiddleware');
const Pets = require('../models/pet');








petsRouter.get('/', (req, res) => {
    console.log('pet search', req.query)

    const searchParams = req.query;
    console.log(searchParams)

    Pets.find({
        weight: { $lte: searchParams.weightmax, $gte: searchParams.weightmin },
        height: { $lte: searchParams.heightmax, $gte: searchParams.heightmin },
        adoptionStatus: searchParams.adoptionStatus || { $ne: null },
        type: searchParams.type || { $ne: null },
        name: searchParams.name || { $ne: null }
    })
        .then(pet => {
            console.log('.then')
            if (pet) {
                console.log('')
                return res.status(200).send(pet)
            }
            return res.status(404).send('Error!')
        }).catch(() => {

            res.send("Error")

        })
})

petsRouter.get('/availablepets', (req, res) => {

    const searchParams = req.query;
    console.log(searchParams)

    Pets.find({adoptionStatus: searchParams.adoptionStatus })
        .then(pet => {
            console.log('.then')
            if (pet) {
                console.log('');
                const listLength = pet.length -4;
                return res.status(200).send({message: "Success", pet, listLength})
            }
            return res.status(404).send('Error!')
        }).catch(() => {

            res.send("Error")

        })
})

petsRouter.put('/adopt/:petId', checkAvailability, verifyJWT, userAddAdopt, async (req, res) => {
    const { petId } = req.params;
    const user = req.user
    console.log(petId)
    console.log('oooo');
    try {
        const pet = await Pets.updateOne(
            { id: `${petId}` },
            { $set: { adoptionStatus: "Adopted" } }
        )

        console.log(pet)
        res.status(200).send({ message: "Success!", user, pet })
    }
    catch (err) {
        console.log(err)
        res.status(404).send('Update object did not work')
    }
});

petsRouter.put('/return/:petId', verifyJWT, userSubtractAdopt, async (req, res) => {
    const { petId } = req.params;
    const user = req.user
    console.log(petId)
    console.log('oooo')
    try {
        const pet = await Pets.updateOne(
            { id: `${petId}` },
            { $set: { adoptionStatus: "Available" } }
        )

        console.log(pet)
        res.status(200).send({ message: "Success!", user, pet })
    }
    catch (err) {
        console.log(err)
        res.status(404).send('Update object did not work')
    }

});

petsRouter.put('/foster/:petId', checkAvailability, verifyJWT, userAddFoster, async (req, res) => {
    const { petId } = req.params;
    console.log(petId);
    console.log('oooo');
    const user = req.user
    try {
        const pet = await Pets.updateOne(
            { id: `${petId}` },
            { $set: { adoptionStatus: "Fostered" } }
        )

        console.log(pet)
        res.status(200).send({ message: "Success!", user, pet })
    }
    catch (err) {
        console.log(err)
        res.status(404).send('Update object did not work')
    }



});

petsRouter.put('/unfoster/:petId', verifyJWT, userSubtractFoster, async (req, res) => {
    const user = req.user;
    const { petId } = req.params;
    console.log('lll');
    try {
        const pet = await Pets.updateOne(
            { id: `${petId}` },
            { $set: { adoptionStatus: "Available" } }
        )

        console.log(pet)
        res.status(200).send({ message: "Success!", user, pet })
    }
    catch {
        console.log(err)
        res.status(404).send('Update object did not work')
    }
});

petsRouter.put('/save/:petId', verifyJWT, isSavedTwice, userAddSave, async (req, res) => {
    const user = req.user
    res.status(200).send({ message: "Success!", user })
})


petsRouter.put('/unsave/:petId', verifyJWT, userSubtractSave, async (req, res) => {
    const user = req.user
    res.status(200).send({ message: "Success!", user })
});



petsRouter.put('/update/:id', verifyJWT, upload.single('image'), async (req, res) => {
    console.log('jell')
    
    const { id } = req.params;
    const pet = {};
    pet.name = req.body.name;
    pet.breed = req.body.breed;
    pet.color = req.body.color;
    pet.height = req.body.height;
    pet.weight = req.body.weight;
    pet.hypoallergnic = req.body.hypoallergnic;
    pet.bio = req.body.bio;
    if (req.file) {
        const imageUrl = req.file.path;
        pet.picture = imageUrl;

    }
    try {
        const newPet = await Pets.findOneAndUpdate(
            { _id: id },
            { $set: pet },
            { new: true }
        )
        console.log(pet);
        let petType;
        if (newPet.adoptionStatus === 'Adopted') {
            petType = 'Adopted';
        }
        else if (newPet.adoptionStatus === 'Fostered') {
            petType = 'Fostered';
        }
        else if (newPet.adoptionStatus === 'Available') {
            petType = 'Saved';
        }
        return res.status(200).send({ message: 'Success', newPet, petType });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Nope')
    }
});

petsRouter.post('/addpet', verifyJWT, upload.single('image'), generateRandomId, async (req, res) => {
    console.log('jell')
    console.log(req.file)
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const imageUrl = req.file.path;


    const pet = new Pets({
        name: req.body.name,
        adoptionStatus: 'Available',
    
        breed: req.body.breed,
        type: req.body.type,
        color: req.body.color,
        height: req.body.height,
        picture: imageUrl,
        dietery: [],
        weight: req.body.weight,
        hypoallergnic:  req.body.hypoallergnic,
        bio: req.body.bio,
        id: req.randomId
    })
    pet.save();
    return res.status(200).send({message: 'Success', pet})
});

petsRouter.get('/petcard/:id', async (req, res)=>{
    const {id} = req.params;
    console.log(id)
    try{
        const pet = await Pets.findOne({id: id});
        console.log(pet);
        return res.status(200).send({message: 'Success!', pet})
    }
    catch(err){
        res.status(500).send(err)
        console.log(err);
    }
})

module.exports = petsRouter;