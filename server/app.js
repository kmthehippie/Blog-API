const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const { connectDB } = require("./config/db_connection")
const allowedOrigins = require("./config/allowed_origins")
const RateLimit =require("express-rate-limit");
const cors = require("cors")
const credentials = require("./middleware/credentials")
const path = require("path"); 

require("dotenv").config();

//Reusable info
const port = process.env.PORT



//Set up limiter
const limiter = RateLimit({
    windowMs: 1* 60 * 1000, //1 min
    max: 20,
})
//Set up Mongoose
mongoose.set("strictQuery", false)
connectDB()


//here need to configure passport by creating a passportConfig file. Also need to require it.

//Routers Required from routes folder
const indexRouter = require("./routes/index")
const postRouter = require("./routes/post")
const postsRouter = require("./routes/posts")
const adminRouter = require("./routes/admin")


//App Initialize
const app = express()

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials)

//Trust first proxy--Fly.io load balancer
app.set("trust proxy", 1)

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/dist')));


//Cors setup 
//TODO: add in correct origin (http://www.fly.io/???) into the allowedOrigins fn.
const corsOptions = {
    origin: (origin, callback)=>{
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error("Not allowed by CORS"))
        }     
    }, 
    optionsSuccessStatus: 200
};

//App uses all the middlewares
app.use(helmet())
app.use(limiter)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression())
app.use(cors(corsOptions))


// Disable the 'X-Powered-By' header
app.disable('x-powered-by');

//Utilize the routers you have made
app.use("/", indexRouter)
app.use("/post", postRouter)
app.use("/posts", postsRouter)
app.use("/admin", adminRouter)


//Catch the 404 and forward to error handler
app.use(function(req,res,next){
    next(createError(404))
})

//Error Handler
app.use(function(err,req,res,next){
    //set locals, only provide error in dev
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}
    res.status(err.status || 500).json({title: "Error", error: err.message})
})

//Server serves build from react catch all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

app.listen(port, ()=>{
    "App is listening on port ",port
})
//Export App
module.exports = app;