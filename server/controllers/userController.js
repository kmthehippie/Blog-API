const User = require("../models/user")
const asyncHandler = require("express-async-handler")
const { body, param, validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


//Helper Functions
const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
const isUnique = async function(fieldValue, { req }) {
    const { field } = req; // Extract the field name from the request
    const existingUser = await User.findOne({ [field]: fieldValue });
    if (existingUser) {
        return Promise.reject(`${field} already exists`);
    }
};
const patchIsUnique = async function(fieldValue, fieldName, { req }) {
    const currentUserId = req.params.userId; 
    const currentUser = await User.findById(currentUserId);
    if (fieldValue === currentUser[fieldName]) {
        return; 
    }
    const existingUser = await User.findOne({ [fieldName]: fieldValue });
    if (existingUser) {
        return Promise.reject(`${fieldName} ${fieldValue} already exists`);
    }
};


//Login POST
exports.login_form_post = [
body("username")
    .trim()
    .isString()
    .customSanitizer(val => val.toLowerCase())
    .escape(),
body("password")
    .trim()
    .escape(),

asyncHandler(async(req,res,next)=>{
    const errors = validationResult(req)
    //Validation Errors Exist
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        try {
            const { username, password } = req.body;
            if (!username || !password) return res.status(400).json({ "message": "Username and Password required" });
            const user = await User.findOne({ username }).exec();
            if (!user) return res.status(401).json({ "message": "Unauthorized: User not found" });
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const userId = user?._id
                const userTypes = user.userTypes ? Object.values(user.userTypes).filter(Boolean) : [];
                const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": user.username,
                        "userId" : user._id,
                        "userTypes" : userTypes
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "15s"} //prev 15m
                )
                const refreshToken = jwt.sign(
                    {"UserInfo": {
                            "username": user.username
                    }},
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn: "60m"} //prev 1d
                )
                user.refreshToken = refreshToken
                await user.save()
               
                res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: "None",
                maxAge: 24 * 60 * 60 * 1000,
                secure: true
                });
                res.json({userId, userTypes, accessToken})
            }else {
                return res.status(401).json({ message: "Unauthorized: Incorrect password" });
            }
        }catch(err){
            res.status(500).json({ "message": `${err.message} Error at Login Form Post` })
        }
    }})
]

//Logout POST
exports.logout_form_post = asyncHandler(async(req,res,next)=>{
    //!On client side, also delete the accessToken

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(204).json({"message": "Cookies-JWT is empty"})
    const refreshToken = cookies.jwt
    const user = await User.findOne({ refreshToken }).exec()
    if(!user){
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None"  }) //!Add secure when out of dev mode
        return res.status(204).json({"message": "A user with this refresh token does not exist. We have cleared the cookies"})
    }
    user.refreshToken = ""
    const result = await user.save()
    res.clearCookie("jwt", {httpOnly: true, sameSite: "None", secure: true}) //!Add secure when out of dev mode
    res.status(204).json({"message": "cookie & refresh token in db has been cleared"})
})

//Register POST
exports.register_form_post = [
//validate and sanitize fields
body("username")
    .trim()
    .isString()
    .customSanitizer(val => val.toLowerCase())
    .escape()
    .custom(isUnique),
body("email")
    .trim()
    .isEmail().withMessage("Invalid email address")
    .customSanitizer(val => val.toLowerCase())
    .escape()
    .custom(isUnique),
body("password")
    .trim()
    .isLength({min:8}).withMessage("Password needs to be 8 chars")
    .matches(pwPattern).withMessage("Password has to be minimum eight characters, at least one letter and one number:"),
body("confirm_password")
    .trim()
    .custom((val, {req})=>{
        if(val !== req.body.password){
            throw new Error("Passwords do NOT match")
        }
        return true;
    }),
    
asyncHandler(async(req,res,next)=>{
    const errors = validationResult(req)
    
    //Validation Errors Exist
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }else{
        try {
            const { username, email, password } = req.body;
            if(!username || !password || !email) return res.status(400).json({ "message": "Username, Email and Password are required"})
            const hashedPw = await bcrypt.hash(password, 10)
            const result = new User({ username, email, password: hashedPw})
            result.save()
            res.status(201).json(`User registered ${result}`)
        } catch(err){
            res.status(500).json({ "message": err.message })
        }
    }
})
]

//GET user details
exports.user_detail_get = asyncHandler(async(req,res,next)=>{
    if(!req?.params?.userId) return res.status(400).json({"message": "User ID Required" })
    const user = await User.findOne({ _id: req.params.userId }).exec();
    if(!user){
        return res.status(204).json({ "message": `User ID ${req.params.id} not found`})
    }
    res.json(user)
})

//PATCH update user details
exports.user_detail_patch = [
body("username")
    .trim()
    .isString()
    .customSanitizer(val => val.toLowerCase())
    .escape(),
body("username").custom((value, { req }) => patchIsUnique(value, "username", {req})).withMessage("Username already exists"),
body("email")
    .trim()
    .isEmail().withMessage("Invalid email address")
    .customSanitizer(val => val.toLowerCase())
    .escape(),
body("email").custom((value, { req }) => patchIsUnique(value, "email", {req})).withMessage("Email already exists"),
asyncHandler(async(req,res,next)=>{
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req?.params?.userId
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: "Unauthorized No User"})
        }
        const { username, email } = req.body;     
        if (username !== user.username) {
            user.username = username;
        }
        if (email !== user.email) {
            user.email = email;
        }
        await user.save();
        res.json(user)
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized!" });
    }  
})]


