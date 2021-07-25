// step 1: import express 
const express = require('express');
// step 2: import router 
const router = express.Router();
// step 8: import express validator, authmiddleware, User and Contact models
const { check, validationResult } = require('express-validator/check');
const auth =require('../middleware/auth');

const User = require('../models/Users');
const Contact = require('../models/Contact');

// step 3: create api end point for users registration
//  step 4: first route

// @route get api/contacts
// @desc  Get all the user's contacts
// @access private 

router.get('/', auth, async (req, res) => {
    try { 
        const contacts = await Contact.find({ user: req.user.id }).sort({ 
            date: -1
    });
    res.json(contacts);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//  step 5: second route

// @route POST api/contacts
// @desc  Add a new contact
// @access private 

router.post('/', [ auth, [
    // 8.1 check validation for express validator
    check('name', 'Name is requied').not().isEmpty()
]], async (req, res) => {
    // 8.2 after check we have to execute to run validation result for error check
    const errors = validationResult(req);
    if(!errors.isEmpty()){
         return res.status(400).json({errors: errors.array()})
    }
    // 8.4 destructuring
    const { name, email, phone, type } = req.body

    try {
        // 8.5 create a new contact in try and catch
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            // the above name, email, and phone of current logged in user in req.body get by id
            user: req.user.id
        })

        // 8.6: after creating new contact now save in data base.
        const contact = await newContact.save();

        // 8.7: now the we need to return the new contact in res in form of jason
        res.json(contact);
    } catch (err) {
        // 8.8: return error
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// step 6: Third route

// @route PUT api/contacts/:id
// @desc  Update a contact
// @access private 

router.put('/:id',auth, async (req, res) => {

    // step 9: after providing path /:id, authintication auth and making function async
    // now its is a update contact route so we will destructure the prameters that we can update/change them any time in body
    const { name, email, phone, type } = req.body;

    // 9.2: now taking the above info we will create an object
    // thise parameters above will come from body/db to update but id will be get
    const contactField = {}; 

    // 9.3 if the above parameter are present than we will update it in contact field
    if(name) contactField.name = name;
    if(email) contactField.email = email;
    if(phone) contactField.phone = phone;
    if(type) contactField.type = type;
    
    // 9.4:now use the above infor we update or change our contact
    try {
        // 9.5: first we will get contact by id
        let contact = await Contact.findById(req.params.id);
        // 9.6: contact is not present, return error msg in res
        if(!contact) return res.status(404).json({ msg: 'This contact does not exist'});
        // 9.7: if the contact exist, than make sure the currently signed in user own the contact
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'You do not have the correct autherization to update this contact' });
        }

        // 9.8 update contact if above conditions pass
        contact = await Contact.findByIdAndUpdate(req.params.id,
            { $set: contactField },
            // 9.9: if contact does not exist so we will allow owner to create a contact
            { new: true }
            );

        //  9.10: return updated contact
        res.json(contact);

    } catch (err) {
        // 9.11
        console.error(err.message);
        res.status(500).send('Serveer Error');
    }

});


// step 7: Fourth route

// @route Delete api/contacts/:id
// @desc  Delete a contact
// @access private 

router.delete('/:id', auth, async (req, res) => {
    // step 10: 
    try {
        // 10.1: first we will get contact by id
        let contact = await Contact.findById(req.params.id);
        // 10.2: contact is not present, return error msg in res
        if(!contact) return res.status(404).json({ msg: 'This contact does not exist'});
        // 10.3: if the contact exist, than make sure the currently signed in user own the contact
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'You do not have the correct autherization to update this contact' });
        }

        // 10.4: find user by id and remove
        await Contact.findByIdAndRemove(req.params.id);

        //  10.5: return a confirmation msg to remove contact
        res.json({ msg: ' This contact has been removed' });

    } catch (err) {
        // 10.6
        console.error(err.message);
        res.status(500).send('Serveer Error');
    }
});


// export to server 
module.exports = router;