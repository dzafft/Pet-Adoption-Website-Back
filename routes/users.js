const userRouter = require('express').Router();
const User = require('../models/user');
const Pets = require('../models/pet');
const { verifyJWT } = require('../middleware/middleware');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');



userRouter.get('/:email', async (req, res)=>{
    const {email} = req.params;
    console.log(email)
    try{
        const user = await User.findOne({email});
        console.log(user);
        return res.status(200).send({message: 'Success!', user})
    }
    catch(err){
        res.status(500).send(err)
        console.log(err);
    }
})

userRouter.get('/person/:id', async (req, res)=>{
    const {id} = req.params;
    console.log(id)
    try{
       
        const user = await User.findOne({_id: id});
        console.log(user);
        return res.status(200).send({message: 'Success...!', user})
    }
    catch(err){
        res.status(500).send(err)
        console.log(err);
    }
})

userRouter.get('/list/:hello', async (req, res)=>{
    const {hello} = req.params;
    console.log(hello);

    try{
        console.log('start')
        const users = await User.find({isAdmin: false});
        console.log(users);
        const admins = await User.find({isAdmin: true});
        console.log(admins)
        return res.status(200).send({message: 'Success??!', users, admins})
    }
    catch(err){
        console.log(err);
        return res.status(404).send('Failure');
    }
})


userRouter.get('/saved/:email', async (req, res)=>{
    const {email} = req.params;
    
    let savedListByIds;
    try{
        const user = await User.findOne({email})
        console.log(user)
        savedListByIds = user.savedPets;
        console.log(savedListByIds)
    }
    catch(err){
        console.log(err)
    }

    console.log(savedListByIds)
    
    try{
        console.log(savedListByIds)
        const petList = [];
        for (let i = 0; i < savedListByIds.length; i++){
            let savedPet = await Pets.findOne({id: savedListByIds[i]});
            petList.push(savedPet)
        }
        
        console.log(petList)
        res.status(200).send({message: "Success!", petList})

    }
    catch(err){
        console.log(err)
        res.status(404).send('Pet list not created')
    }    

})

userRouter.get('/fostered/:email', async (req, res)=>{
    const {email} = req.params;
    
    let fosteredListByIds;
    try{
        const user = await User.findOne({email})
        console.log(user)
        fosteredListByIds = user.fosteredPets;
        console.log(fosteredListByIds)
    }
    catch(err){
        console.log(err)
    }

    console.log(fosteredListByIds)
    
    try{
        console.log(fosteredListByIds)
        const petList = [];
        for (let i = 0; i < fosteredListByIds.length; i++){
            let fosteredPet = await Pets.findOne({id: fosteredListByIds[i]});
            petList.push(fosteredPet)
        }
        
        console.log(petList)
        res.status(200).send({message: "Success!", petList})

    }
    catch(err){
        console.log(err)
        res.status(404).send('Pet list not created')
    }    

})

userRouter.get('/adopted/:email', async (req, res)=>{
    const {email} = req.params;
    
    let adoptedListByIds;
    console.log('start')
    try{
        const user = await User.findOne({email})
        console.log(user)
        adoptedListByIds = user.adoptedPets;
        console.log(adoptedListByIds)
    }
    catch(err){
        console.log(err)
    }

    console.log(adoptedListByIds)
    
    try{
        console.log(adoptedListByIds)
        const petList = [];
        for (let i = 0; i < adoptedListByIds.length; i++){
            let adoptedPet = await Pets.findOne({id: adoptedListByIds[i]});
            petList.push(adoptedPet)
        }
        
        console.log(petList)
        res.status(200).send({message: "Success!", petList})

    }
    catch(err){
        console.log(err)
        res.status(404).send('Pet list not created')
    }    

})

userRouter.put('/update/:oldEmail', verifyJWT, async (req, res)=>{
    const { oldEmail} = req.params;
    const updateUser = req.body;
    console.log(updateUser)
    console.log(oldEmail);

    if (updateUser.password){
        console.log(updateUser.password);
        updateUser.password = await bcrypt.hash(updateUser.password, 10)
    }
    else{
        delete updateUser.password;
    }

    if (!updateUser.bio){
        delete updateUser.bio;
    }
    console.log(updateUser)
    
    try{
        const user = await User.findOneAndUpdate(
            { email: `${oldEmail}` },
            { $set: updateUser },
            {new: true}
        )
        console.log(user);
        res.status(200).send({message: 'Success', user});
    }
    catch(err){
        if ((err instanceof TokenExpiredError)){
            console.log('log in again')
            return res.status(404).send('Log in again!')
        }
        console.log(err);
        res.status(500).send('Nope')
    }
})

userRouter.get('/mostsavedpets/:oo', async (req, res) =>{
    const {oo} = req.params;
    console.log('jjajajjaajajjajaajjaaj')
    try{
        const savedPetsList =[];
        const searchKey = 'savedPets';
        const users = await User.find({});
        console.log(users)
        for (let i = 0; i < users.length; i++){
            for (let key in users[i]){
                if (key === searchKey){
                    console.log(users[i][key])
                    for (let j = 0; j < users[i][key].length; j++){
                        savedPetsList.push(users[i][key][j]);
                    }
                }
            }
        }
        console.log(savedPetsList)

        function sortByFrequency(arr) {
            const frequency = {};
            
            
            for (let item of arr) {
              frequency[item] = (frequency[item] || 0) + 1;
            }
            
            
            arr.sort((a, b) => frequency[b] - frequency[a]);
            
            return arr;
          }
          
          const sortedArray = sortByFrequency(savedPetsList);
          
          console.log(sortedArray);

          if (sortedArray.length > 7) {
            sortedArray.splice(7);
          }

        try{
        const petList = [];
        for (let z = 0; z < sortedArray.length; z++){
            let adoptedPet = await Pets.findOne({id: sortedArray[z]});
            petList.push(adoptedPet)
        }
        
        console.log(petList)
        res.status(200).send({message: "Success", petList})

        }
        catch(err){
            console.log(err)
            res.status(404).send('Pet list not created')
        }    

    }
    catch(err){
        console.log(err);
    }

    
})

userRouter.get('/status/:email/:id', async (req, res)=>{
    console.log(';;;;;;')
    const email = req.params.email;
    const id = req.params.id;
    console.log('smetlnv;ksjnvkj')

    try{
        let isTrue = false;
        const user = await User.findOne({email: email});
        console.log(user)
        if (user.adoptedPets.includes(id) || user.fosteredPets.includes(id) || user.savedPets.includes(id)){
            isTrue = true;
            return res.status(200).send({message: "Success!", isTrue})
        }
        return res.status(200).send({message: "Success!", isTrue})
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }

})


module.exports = userRouter;