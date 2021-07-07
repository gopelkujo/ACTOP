const mongoose = require("mongoose")
const passportlocalmongoose = require("passport-local-mongoose")

const personSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    nama: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tgl_lahir: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    harapan_user: {
        type: String,
        required: false
    }
})

personSchema.plugin(passportlocalmongoose)
const person = new mongoose.model("persons", personSchema)
module.exports = person