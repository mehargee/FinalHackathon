const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");


require('../db/conn');
const User = require('../model/userSchema');

// router.use(cookieParser());

router.get('/', (req, res) => {
    res.send("Hello from the MERN Home router js page");
});

// registration || signup route
router.post('/register', async (req, res) => {

    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        return res.status(422).json({ error: "filled the all field" })
    }

    try {

        const userExist = await User.findOne({ email: email }) //is email ka sara data aa gya ha
        if (userExist) {

            return res.status(422).json({ error: "Email already exist" });
        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "password are not matching" });
        }
        else {
            const user = new User({ name, email, password, cpassword }); //key:value
            // save hone se phly midlware call ho ra jo passwor ko hash kry ga, userSchma me code hai
            await user.save();

            res.status(201).json({ message: "user register sucessfully" });
            console.log("user register sucessfully..");
        }

    }
    catch (error) {
        console.log("error", error);

    }

});

//login route
router.post('/login', async (req, res) => {
    // console.log("auth signin route up");
    try {
        // console.log("auth signin route inn");
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "fill the both fields" });
        }

        const userLogin = await User.findOne({ email: email })

        if (userLogin) {
            //compare hash passwoord DB
            const isMatch = await bcrypt.compare(password, userLogin.password)

            //call function when user is login
            token = await userLogin.generateAuthToken();
            //console.log(token);

            //cookie(cookieNmae, value)
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000), //after one month token expire
                httpOnly: true    //otherwise only run on secure https
            });

            if (!isMatch) {

                res.status(400).json({ error: "user invalid" })
            }
            else {
                console.log("user login sucessfully");
                res.status(200).json({ message: "user login sucessfully" });
            }
        } else {
            res.status(400).json({ error: "user invalid" })
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: "error" })
    }
    
});


// about us page route


router.get('/about', authenticate, (req, res) => {
    console.log(`hello i am about page`);
    res.send(req.rootUser);
});

//Get user data for contact US page and home page
router.get('/getdata', authenticate, (req, res) => {
    console.log(`hello i am get data contact page`);
    res.send(req.rootUser);
});

//sent message from contact us page to DB
router.post('/contact', authenticate, async (req, res) => {
    const { name, email, phone, message } = req.body;
    try {
        console.log(`hello i am message contact page`);


        if (!name || !email || !phone || !message) {
            console.log(`Error in contact form`);
            return res.json({ error: "Plz filled the contact form" })
        }

        const userContact = await User.findOne({ _id: req.userID });

        if (userContact) {

            const userMessage = await userContact.addMessgae(name, email, phone, message);
            await userContact.save();

            res.status(201).json({ message: "user contact msg sucessfully..!" })
        }

    } catch (error) {
        console.log(error);
    }

});

// logout page route 
router.get('/logout', (req, res) => {
    console.log(`hello i am logout page`);
    res.clearCookie('jwtoken', { path: '/' })
    res.status(200).send("user logout")
});


module.exports = router;