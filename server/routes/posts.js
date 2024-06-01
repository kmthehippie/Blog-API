const express = require("express")
const router = express.Router()
const refresh_token_controller = require("../controllers/refreshTokenController")
const Category = require("../models/category")
const Post = require("../models/post")

const post_controller = require("../controllers/postController")
const asyncHandler = require("express-async-handler")
//GET for many posts
router.get("/", post_controller.user_last4posts_get)

router.get("/all", post_controller.user_posts_get)

//GET for category page
router.get("/:categoryName", asyncHandler(async(req,res,next)=>{
    const category = await Category.find({category: req.params.categoryName})
    const catId = category[0]._id.toString()
    const posts = await Post.find({category: catId})
    res.send(posts)
}))

module.exports = router