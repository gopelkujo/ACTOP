const mongoose = require('mongoose')
require('../node_modules/dotenv/config')

const InitiateMongoServer = async () => {
    mongoose.connect(process.env.DB_CONNECTION, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    let db = mongoose.connection

    db.on('error', console.error.bind(console, 'Database connect Error!'))
    db.once('open', () => {
        console.log('Database is Connected!')
    })
}

module.exports = InitiateMongoServer