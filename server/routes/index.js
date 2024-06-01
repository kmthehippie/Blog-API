const express = require("express")
const router = express.Router()
//require controller modules
const post_controller = require("../controllers/postController")
const refresh_token_controller = require("../controllers/refreshTokenController")
const user_controller = require("../controllers/userController")
const correctRoute = require("../middleware/correctRoute")
const asyncHandler = require("express-async-handler")
const verifyJWT = require("../middleware/verifyJWT")
const USERTYPE_LIST = require("../config/usertype_list")
const verifyUserType = require("../middleware/verifyUserType")


router.get("/api/data", post_controller.user_posts_get)


//POST User Login //RECEIVE DATA FROM CLIENT
router.post("/login", user_controller.login_form_post)


//TODO:: POST User Login //RECEIVE DATA FROM CLIENT

//POST User Logout
router.post("/logout", user_controller.logout_form_post)

//Get User register //NO DATA TO SEND
router.get("/register", function(req,res,next){
    res.send("this is the register. should be a form")
})


//GET REFRESH
router.get("/refresh", refresh_token_controller.handle_refresh_token)

//POST User register //RECEIVE DATA FROM CLIENT
router.post("/register", user_controller.register_form_post)

//GET User page //SEND DATA TO CLIENT IF USER IS LOGGED IN
router.get("/user/:userId", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.User), asyncHandler(correctRoute), user_controller.user_detail_get)

//get User page for updating (update user details)
router.get("/user/:userId/update", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.User), asyncHandler(correctRoute), user_controller.user_detail_get)

//PATCH User page (update user details)
router.patch("/user/:userId/update",asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.User), asyncHandler(correctRoute), user_controller.user_detail_patch)



module.exports = router