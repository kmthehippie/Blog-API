const express = require("express");
const router = express.Router();    
const asyncHandler = require("express-async-handler")
const refresh_token_controller = require("../controllers/refreshTokenController")
const post_controller = require("../controllers/postController")
const verifyJWT = require("../middleware/verifyJWT")
const verifyUserType = require("../middleware/verifyUserType")
const USERTYPE_LIST = require("../config/usertype_list")

//POST ROUTES//
//GET postId -- page for specific post
router.get("/:postId", post_controller.user_post_get)

//GET postid create new comment (form)
router.get("/:postId/comment/new", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.User), function(req,res,next){
    res.send("Hello new comment form here")
})

//POST postid create new comment (form) + Make sure commenter is logged in.
router.post("/:postId/comment/new", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.User), post_controller.user_new_comment_post)

//GET postid create new comment (form)
//Only accessible for the user who wrote the comment and admin
router.get("/:postId/comment/:commentId/update",asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.User), post_controller.user_comment_get)

//PATCH "/:postId/comment/:commentId/update"
router.patch("/:postId/comment/:commentId/update", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.User), post_controller.user_comment_patch)

//GET "/:postId/comment/:commentId/delete"
router.get("/:postId/comment/:commentId/delete", asyncHandler(verifyJWT), verifyUserType(USERTYPE_LIST.User), post_controller.user_comment_get)

//DELETE "/:postId/comment/:commentId/delete"
router.delete("/:postId/comment/:commentId/delete", asyncHandler(verifyJWT),verifyUserType(USERTYPE_LIST.User), post_controller.user_comment_delete)

module.exports = router