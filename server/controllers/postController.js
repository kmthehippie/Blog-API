const User = require("../models/user")
const Post = require("../models/post")
const Comment = require("../models/comment")
const asyncHandler = require("express-async-handler")
const { body, param, validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

//POSTS -- CONTROLLER 
// Display all published posts
exports.user_posts_get = asyncHandler(async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number (default: 1)
        const limit = parseInt(req.query.limit) || 10; // Number of posts per page (default: 10)
        const startIndex = (page - 1) * limit; // Calculate starting index of posts for the current page
        // Query condition to filter posts by status "Publish"
        const query = { status: "Publish" };
        let postsQuery = Post.find(query)
        .skip(startIndex)
        .sort({date: -1})
        .limit(limit)
        .populate('author', 'username');      
        const posts = await postsQuery.exec();
        const totalPublishedPosts = await Post.countDocuments(query);
        const totalPages = Math.ceil(totalPublishedPosts / limit);
        res.json({
            page,
            totalPages,
            posts
        });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//GET: last 4 posts
// GET: last 4 posts
exports.user_last4posts_get = asyncHandler(async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 4; // Number of posts per page (default: 4)
    
        const posts = await Post.find({ status: "Publish" })
            .sort({ date: -1 }) // Sort by date in descending order to get the latest posts first
            .limit(limit) // Limit the number of posts to the specified limit
            .populate('author', 'username');
            
        res.json({
            posts
        });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//TODO:: Display category 

//POST -- CONTROLLER
exports.user_post_get = asyncHandler(async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId)
            .populate({
                path: 'author',
                select: 'username' // Only include the username field
            })
        const comments = await Comment.find({ post: postId }).populate({
            path: 'user',
            select: 'username' // Only include the username field
        })

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the post status is "Publish"
        if (post.status === "Publish") {
            const responseData = {
                post: post,
                comments: comments,
            };
            return res.status(200).json(responseData);
        } else {
            // If the post status is not "Publish", return a 404 status with a message
            return res.status(404).json({ message: "Post not published" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//POST create new comment
exports.user_new_comment_post = [
    body("comment")
    .trim()
    .notEmpty().withMessage("Comment cannot be empty")
    .isString()
    .escape(),

    asyncHandler(async(req,res,next)=>{
        const postId = req.params.postId
        const errors = validationResult(req)
        const { comment } = req.body
        //create userId and req.user.userId
        const userId = req.userId
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        } else {   
            const newComment = new Comment({
                post: postId,
                comment: comment,
                user: userId
            })
            try {
                const savedComment = await newComment.save()
                res.status(201).json(savedComment)
            } catch(err) {
                console.log(err)
                next(err)
            }
        }
    })
]

//GET update comment (need to be user == user)
exports.user_comment_get = asyncHandler(async(req,res,next)=>{
    const commentId = req.params.commentId
    const userId = req.userId
    try{
        const prevComment = await Comment.findById(commentId)
        if(prevComment.user.toString() === userId){
            return res.status(200).json(prevComment)
        } else {
            return res.status(404).json({message: "Unauthorized at user comment get."})
        }
    }catch(error){
        next(error)
    }
})

//PATCH update comment (need to be user == user)
exports.user_comment_patch = [
    body("comment")
    .trim()
    .notEmpty().withMessage("Comment cannot be empty")
    .isString()
    .escape(),

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req)
        const { comment } = req.body
        const userId = req.userId
        const commentId = req.params.commentId
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        } else {   
            try{
                const prevComment = await Comment.findById(commentId)
                if(prevComment.user.toString() === userId){
                    prevComment.comment = comment
                } else {
                    return res.status(404).json({message: "Unauthorized at User Comment Patch."})
                }
                await prevComment.save()
                res.json(prevComment)
            }catch(err){

                return res.status(401).json({message: "Unauthorized at User Comment Patch."})
            }
        }
    })
]

exports.user_comment_delete = asyncHandler(async(req,res,next)=>{
    const commentId = req.params.commentId
    const userId = req.userId
    try{
        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(404).json({ message: "Comment not found"})
        }
        if(comment.user.toString() === userId.toString()){
            await Comment.findByIdAndDelete(commentId)
            res.status(200).json({message: "Comment deleted successfully"})
        }
    }catch(err){
        res.status(500).json({message: "Internal server error!"})
    }
})