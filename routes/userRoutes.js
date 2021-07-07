const express = require('express')
const router = express.Router()
const person = require('../models/personSchema')
const jwt = require('jsonwebtoken')
// const auth = require('../middleware/auth')

router.use(express.json())

// CREATE USER
router.post('/register', async (req, res) => {
    const userRegistration = new person({
        username: req.body.username,
        nama: req.body.nama,
        email: req.body.email,
        password: req.body.password,
        tgl_lahir: req.body.tgl_lahir,
        harapan_user: req.body.harapan_user
    })

    try{
        const testt = await userRegistration.save()
        res.send(`Account ${req.body.username} is Actived!`)
        // res.writeHead(200, { 'Content-Type': 'text/plain' })
        // res.json(testt)
    }catch(err){
        res.json({message: err})
    }
})

// LOGIN USER
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body
//     try{
//         const user = await person.findOne({username})
//         if(!user) {
//             return res.status(400).json({message: 'user not exist!'})
//         } else {
//             if(password.localeCompare(user.password)) {
//                 return res.status(400).json({message: 'Incorrect Password!'})
//             } else {
//                 return res.send(`Login Success!\n\n welcome ${user.username}`)
//             }
//         }
//     } catch {
//         res.json({message: 'error'})
//     }
// })

// USER LOGGED IN
// router.get("/user", auth, async (req, res) => {
//     try {
//       // request.user is getting fetched from Middleware after token authentication
//       console.log(req.user.id)
//       const user = await person.findById(req.user.id);
//       res.json(user);
//     } catch (e) {
//       res.send({ message: "Error in Fetching user" });
//     }
// })

// UPDATE
router.put('/:testId', async (req, res) => {
    try{
        const testUpdate = await userRegistration.updateOne({_id: req.body.testId}, {
            nama: req.body.nama,
            alamat: req.body.alamat
        })
        res.json(testUpdate)
    }catch(err){
        res.json({message: err})
    }
})

// DELETE
router.delete('/:testId', async (req, res) => {
    try{
        const testUpdate = await userRegistration.deleteOne({_id: req.body.testId}, {
            nama: req.body.nama,
            alamat: req.body.alamat
        })
        res.json(testUpdate)
    }catch(err){
        res.json({message: err})
    }
})

module.exports = router