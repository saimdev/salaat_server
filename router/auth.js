const express = require("express")
const router = express.Router()
const User = require("../model/userSchema");
const Timing = require("../model/timingSchema");
var nodemailer = require('nodemailer');

const multer = require('multer');



router.post('/register', (req, res) => {
    const { fullname, masjid, password, latitude, longitude} = req.body;
    console.log(fullname, masjid, password);
    if (!fullname || !masjid || !password || !latitude || !longitude) {
        return res.status(422).json({ error: "Please Fill Missing Fields" })
    }

    if (password.length < 8) {
        return res.status(422).json({ error: "Password must be at least 8 characters long." })
    }

    User.findOne({ masjid: masjid }).then((userExist) => {
        if (userExist) {
            return res.status(422).json({ error: "Masjid Already Registered" })
        }

        const newUser = new User({ fullname, masjid, password, longitude, latitude })
        newUser.save().then(() => {
            return res.status(201).json({ message: "Sucessfully Registered" })
        }).catch((err) => { console.log(err); })
        console.log(req.body)
    })    
});

router.post('/login', (req, res) => {
    const { masjid, password } = req.body
    if (!masjid || !password) { 
        return res.status(422).json({ error: "Please Fill Missing Field" })
    }
    if (password.length < 8) {
        return res.status(422).json({ error: "Password must be at least 8 characters long." })
    }

    User.findOne({ masjid: masjid }).then((checkUser) => {
        if (checkUser) {
            if (password == checkUser.password) {
                res.status(200).json({ message: "Login Sucessfull", userData:checkUser })   
            } else {
                res.status(401).json({ error: "Invalid Masjid Name Or Password" })
            }
        }
        else {
            res.status(400).json({ error: "Masjid Not Found" })
        }
    }).catch((err) => { console.log(err) })
})



  router.post('/get_user', async (req, res) => {
    try {
        const {email} = req.body;
        console.log(email);
        const user = await User.findOne({ email: email });
        console.log(user);
        if (!user){
            return res.status(400).json({error: 'User not Found'});
        }
     console.log(user);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/get_all_mosques', async (req, res)=>{
    try{
        const mosques = await User.find();
        if (!Array.isArray(mosques)) {
            console.error("Unexpected response from the database:", mosques);
            return res.status(500).json({ 'error': 'Internal Server Error' });
          }
          console.log(mosques);
        const mosquesData = mosques.map((mosque)=>({
            _id: mosque._id,
            fullname: mosque.fullname,
            masjid: mosque.masjid,
            longitude: mosque.longitude,
            latitude: mosque.latitude,
        }));
        
        res.status(200).json(mosquesData);
    }catch (err){
        console.log(err);
        res.status(500).json({'error':'Internal Server Error'});
    }
});

router.post('/setTimings', async (req, res) => {
    try {
        const { userId, timeFajr, timeAsr, timeZuhr, timeMaghrib, timeIsha, timeJummah } = req.body;
        
        let timingData = await Timing.findOne({ user: userId });

        if (!timingData) {
            timingData = new Timing({
                user: userId,
                fajr: timeFajr,
                asr: timeAsr,
                zuhr: timeZuhr,
                maghrib: timeMaghrib,
                isha: timeIsha,
                jumma:timeJummah,
            });
        } else {
            timingData.fajr = timeFajr;
            timingData.asr = timeAsr;
            timingData.zuhr = timeZuhr;
            timingData.maghrib = timeMaghrib;
            timingData.isha = timeIsha;
            timingData.jumma = timeJummah;
        }

        await timingData.save();

        res.status(200).json({ message: 'Timings saved successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/getTimings', async (req, res) => {
    try {
        const { userId } = req.body;
    
        const timingData = await Timing.findOne({ user: userId });

        if (!timingData) {
            return res.status(404).json({ message: 'Timing data not found for the specified user' });
        }

        res.status(200).json({ timingData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





module.exports = router;

