/*****************************/
/* IMPORT KEBUTUHAN APLIKASI */
/*****************************/
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

// MERANGKAI PORT
app.listen(process.env.PORT, () => {
    console.log(`server is running in ${process.env.PORT}`)
})

// MENYAMBUNG KE DATABASE
const initiateMongoServer = require('./database/connect')
initiateMongoServer()

/*******************/
/* KEPERLUAN LOGIN */
/*******************/
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

// fungsi untuk ngecek apakah user sudah login atau belum
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}
/* SESI KEPERLUAN LOGIN SELESAI */

/*******************************************/
/* MENYAMBUNGKAN FRONT-END DENGAN BACK-END */
/*******************************************/

// set folder template
const templates_path = path.join(__dirname, "./templates/views" )

// apaan yak
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname))

// set .hbs sebagai template HTML
app.set("view engine", "hbs")
app.set("views", templates_path)

app.use(userRoutes)

/* PENTING!!! */
// halaman home
// jika linknya mengarah ke / contoh http://localhost:3003/
// maka akan me-load file .hbs yang berbentuk HTML
app.get("/", (req, res) =>{ 
    res.render("index", {}) //index ini adalah file .hbs, untuk memanggilnya tidak perlu menggunakan .hbs
})

// halaman error
// jika linknya mengarah ke /error contoh http://localhost:3003/error
// maka akan me-load file 404.hbs yang berbentuk HTML
app.get("/error", (req, res) =>{
    res.render("404", {})
})

// halaman register
app.get("/register", (req, res) => {
    if (req.isAuthenticated()) { // req.isAuthenticated untuk mengecek apakah user sudah login atau belum
        res.redirect("/user") // jika sudah akan langsung diarahkan ke dashboard user
    } else {
        res.render("register") // jika belum, akan me-load register.hbs
    }
})


// halaman login
app.get("/login", (req, res) => {
    if (req.isAuthenticated()) { // req.isAuthenticated untuk mengecek apakah user sudah login atau belum
        res.redirect("/user") // jika sudah akan langsung diarahkan ke dashboard user
    } else {
        res.render("login") // jika belum, akan me-load login.hbs
    }
})

// keperluan login dari tutorial
app.post('/login', passport.authenticate('local', { successRedirect: '/user', failureRedirect: '/login'}))

// halaman user (dashboard)
app.get("/user", isLoggedIn, (req, res) => {
    res.render("user", {userDetail: req.user})
})

// halaman contoh update point
app.get("/update-point", isLoggedIn, (req, res) => {
    res.render("update-point", {userDetail: req.user})
})

// untuk mengatur peng-update-tan point
app.post("/update-point", async(req, res) => {
    try{
        const user_id = req.user._id // mengambil _id dokumen dari database
        const new_user_point = parseInt(req.user.point) + parseInt(req.body.point) // point sebelumnya + point yang didapat
        var new_badge = "" // variable untuk menyimpan bage baru
        // algoritma penentuan badge
        if(new_user_point >= 0 && new_user_point < 50) {
            new_badge = "Si Pemalas"
        }
        if(new_user_point >= 50 && new_user_point < 100) {
            new_badge = "Si Rajin"
        }
        if(new_user_point >= 100 && new_user_point < 150) {
            new_badge = "Si Ambis"
        }
        if(new_user_point >= 150 && new_user_point < 200) {
            new_badge = "Si Konsisten"
        }
        if(new_user_point >= 200) {
            new_badge = "Si Sukses"
        }
        // proses peng-update-tan data user point dan badge
        await person.updateOne({_id: user_id}, {
            point: new_user_point,
            badge: new_badge
        })
        res.redirect('/user') // jika berhasil akan me-redirect ke halaman user (dashboard)
    }catch(err){
        res.json({message: err}) // jika error akan memunculkan pesan error
    }
})

// halaman change-password
app.get('/change-password', isLoggedIn, (req, res) => {
    res.render('change-password', {userDetail: req.user}) // parameter "{userDetail: req.user}" untuk mengambil data user
})

// untuk mengatur halaman change-password
app.post("/change-password", async(req, res) => {
    try{
        const user_id = req.user._id // variabel untuk menyimpan _id user
        if(req.body.oldpassword != req.user.password) { // jika password lama dan sama
            await person.updateOne({_id: user_id}, { // memulai proses peng-update-tan password baru
                password: req.body.newpassword,
            })
            res.redirect('/user') // pindah halaman ke /user
        } else {
            res.redirect('/change-password') // jika password lama dan baru sama makan mengganti password gagal dan me-refresh halaman
        }
    }catch(err){
        res.json({message: err}) // jika terjadi kesalahan maka akan memunculkan error
    }
})

// untuk logout
app.get("/logout", function (req, res) {
    req.logout()
    res.redirect("/") // pindah ke halaman home
})
