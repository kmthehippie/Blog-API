const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/adminController")
const refresh_token_controller = require("../controllers/refreshTokenController")
const verifyJWT = require("../middleware/verifyJWT")
const verifyUserType = require("../middleware/verifyUserType")
const USERTYPE_LIST = require("../config/usertype_list")
const asyncHandler = require("express-async-handler")



//GET admin dashboard, (edit perms for users)
router.get("/dashboard/users", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin, USERTYPE_LIST.Editor), admin_controller.dashboard_users_get)

//PATCH admin dashboard (edit perms for users)
router.patch("/dashboard/users/:userId/userTypes", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin), admin_controller.dashboard_users_patch)

//GET admin dashboard, (edit publish or not)
router.get("/dashboard", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin, USERTYPE_LIST.Editor), admin_controller.admin_posts_get)

//PATCH admin dashboard (edit publish or not)
router.patch("/dashboard/:postId/status", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin), admin_controller.admin_posts_patch)

//DELETE admin comment for a specific post
router.delete("/dashboard/:postId/:commentId/delete", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin), admin_controller.admin_comments_delete)

//TODO:: GET admin create new post
router.get("/post/new", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin, USERTYPE_LIST.Editor), (req,res,next)=>{
    res.send("form to create new post")
})

//POST admin create new post
router.post("/post/new", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin, USERTYPE_LIST.Editor), admin_controller.admin_blogpost_new_post)

//GET specific post for update
router.get("/post/:postId/update", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin, USERTYPE_LIST.Editor), admin_controller.admin_blogpost_get)

//GET update for the post
router.post("/post/:postId/update", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin, USERTYPE_LIST.Editor), admin_controller.admin_blogpost_update_post)

//DELETE admin delete post!
router.delete("/post/:postId/delete", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin, USERTYPE_LIST.Editor), admin_controller.admin_blogpost_delete)

// //GET admin create new category
// router.get("/category/new",asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin), (req,res,next)=>{
//     res.send("Form to create new category")
// })

// //POST admin create new category
// router.post("/category/new", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.Admin), admin_controller.admin_category_post)

module.exports = router;