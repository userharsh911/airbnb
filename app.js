const express = require("express");
const path = require("path");
const rootdir = require("./utils/utilis")
const userRouter = require("./routes/storeRouter");
const {hostRouter} = require("./routes/hostRouter")
const {pageNotFoundController} = require("./controllers/error");
const { default: mongoose } = require("mongoose");
const authRouter = require("./routes/authRouter");
// import dotenv from "dotenv"
const dotenv = require("dotenv")
const session = require("express-session")
const mongoStore = require("connect-mongodb-session")(session)
// const DB_PATH = "mongodb+srv://userharsh911:aqMvAtWcl62PC3M7@cluster0.ddrr2.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
console.log("process ",process.env.DB_PATH)
app.use(express.urlencoded())
app.set('view engine','ejs')
app.set('views','views')
app.use(express.static(path.join(rootdir,"public")))

const store = mongoStore({
    uri : process.env.DB_PATH,
    collection: 'sessions'
})
app.use(session({
    secret : "complete nodejs",
    resave : false,
    saveUninitialized : true,
    store
}))


app.use((req,res,next)=>{
    // req.isLoggedIn = req.get('Cookie')?.split("=")[1]==='true' || false
    req.isLoggedIn = req.session.isLoggedIn
    next();
})

app.use("/auth",authRouter)

app.use('/host',(req,res,next)=>{
    if(req.session.user.userType=='guest' || !req.isLoggedIn){
        return res.redirect("/")
    }
    next();
})

app.use("/host",hostRouter);

app.use(userRouter);
app.use(pageNotFoundController)


mongoose.connect(process.env.DB_PATH)
.then(()=>{
    console.log("connected ")
})
.catch((err)=>{
    console.log("error while connecting to mongodb : ",err)
})

export default app;
