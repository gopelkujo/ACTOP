const express = require('express')
const app = express()
const path = require('path')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const session = require('express-session')
const userRoutes = require('./routes/userRoutes.js')
const person = require('./models/personSchema')
require('hbs')
require('./node_modules/dotenv/config')

// SET UP PORT
app.listen(process.env.PORT, () => {
    console.log(`server is running in ${process.env.PORT}`)
})

// CONNECT TO DATABASE
const initiateMongoServer = require('./database/connect')
initiateMongoServer()

app.use(session({
    secret: 'i&qwue*9102*91*A8aY8*&)(@&$UG617yqgwe^qi!@t36',
    resave: false,
    saveUninitialized: false
}));

passport.serializeUser(function (user, done) {
    done(null, user._id)
})

passport.deserializeUser(function (id, done) {
    person.findById(id, function (err, user) {
        done(err, user)
    })
})

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(function (uname, pw, done) {
    person.findOne({ username: uname }, (err, user) => {
        if (err) return done(err)
        if (!user) return done(null, false, { message: 'User not found!' })
        if(!pw.localeCompare(user.password)) {
            done(null,user)
        } else {
            return done(null, false, { message: 'Incorrect password!' })
        }
    })
}))

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

// GET FRONTEND COMPONENT
const templates_path = path.join(__dirname, "./templates/views" )

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))

app.set("view engine", "hbs")
app.set("views", templates_path)

// ROUTES
app.use(userRoutes)

app.get("/", (req, res) =>{
    res.render("index", {})
})

app.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/user")
    } else {
        res.render("register")
    }
})

app.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/user")
    } else {
        res.render("login")
    }
})

app.post('/login', passport.authenticate('local', { successRedirect: '/user', failureRedirect: '/login'}))

app.get("/user", isLoggedIn, (req, res) => {
    res.render("user", {userDetail: req.user})
})

app.get("/logout", function (req, res) {
    req.logout()
    res.redirect("/")
})
