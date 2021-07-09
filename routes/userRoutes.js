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
        harapan_user: req.body.harapan_user,
        point: 0,
        badge: "Si Pemalas"
    })

    try{
        const testt = await userRegistration.save()
        res.send(`Account ${req.body.username} is Actived!`)
    }catch(err){
        res.json({message: err})
    }
})

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