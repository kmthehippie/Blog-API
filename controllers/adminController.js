const User = require("../models/user")
const Post = require("../models/post")
const Category = require("../models/category")
const Comment = require("../models/comment")
const asyncHandler = require("express-async-handler")
const { body, param, validationResult} = require("express-validator")
const USERTYPE_LIST = require("../config/usertype_list")




//Get all users
exports.dashboard_users_get = asyncHandler(async(req,res,next)=>{
    try {
        const page = parseInt(req.query.page) || 1; // Current page number (default: 1)
        const limit = parseInt(req.query.limit) || 10; // Number of users per page (default: 10)

        const startIndex = (page - 1) * limit; // Calculate starting index of users for the current page

        // Fetch users with pagination using Mongoose's skip() and limit() methods
        const users = await User.find().skip(startIndex).limit(limit);

        res.json({
            page,
            totalPages: Math.ceil(await User.countDocuments() / limit),
            users
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//! Front end -- when you change the usertype and hit "SAVE" btn then it will update.
exports.dashboard_users_patch = [
    body("userTypes")
    .trim()
    .notEmpty().withMessage('User type is required')
    .isIn(['Admin', 'Editor', 'User']).withMessage('Invalid user type'),
    asyncHandler(async(req,res,next)=>{
        try {
            const { userId } = req.params;
            const { userTypes } = req.body;
            console.log(userId, userTypes)
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            let userTypeObj = {};
            userTypes.forEach(id => {
                if (Number(USERTYPE_LIST.Admin) === Number(id)) {
                    userTypeObj.Admin = id;
                } else if (Number(USERTYPE_LIST.Editor) === Number(id)) {
                    userTypeObj.Editor = id;
                } else if (Number(USERTYPE_LIST.User) === Number(id)) {
                    userTypeObj.User = id;
                }
            });
            
            user.userTypes = userTypeObj;
            await user.save();
            res.json({ message: 'User type updated successfully', user });

        } catch (error) {
            console.error('Error updating user type:', error);
            res.status(500).json({ message: 'Internal server error when trying patch' });
        }
    })
]

//Front end -- from a form
exports.admin_blogpost_new_post = [
    body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isString()
    .escape(),
    body("snippet")
    .trim()
    .isString()
    .escape(),
    body("content")
    .notEmpty().withMessage("Blogpost text content is required."),
    body("status")
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['Publish', "Don't Publish"]).withMessage("Invalid setting. Must be Publish or Don't Publish"),
    body("imgurl").optional().isURL().default('https://images.pexels.com/photos/24206820/pexels-photo-24206820/free-photo-of-two-pictures-of-a-rainbow-on-a-wall.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'), 
    
    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req)
        const { title, snippet, content, status, imgurl } = req.body
        const adminUserId = req.userId
    
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        } else {   
            const newBlogPost = new Post({
                title: title,
                snippet: snippet,
                content: content,
                status: status,
                date: Date.now(),
                imgurl: imgurl,
                author: adminUserId
            })
            try {
                const savedPost = await newBlogPost.save()
                res.status(201).json(savedPost)
            } catch(err) {
                next(err)
            }
        }
    })
]

//GET: 10 blog post per page 
exports.admin_posts_get = asyncHandler(async(req,res,next)=>{
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 20; 
        const startIndex = (page - 1) * limit; 
        const posts = await Post.find()
        .sort({date: -1})
        .skip(startIndex)
        .limit(limit)
        .populate({
            path:"author",
            select:"username"
        })
        const totalPosts = await Post.countDocuments()

        res.json({
            page,
            totalPages: Math.ceil(totalPosts / limit),
            posts
        });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//PATCH: publish and don't publish a post
exports.admin_posts_patch = [
    body("status")
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['Publish', "Don't Publish"]).withMessage('Invalid status'),
    asyncHandler(async(req,res,next)=>{
        try {
            const { postId } = req.params;
            const { status } = req.body;
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            post.status = status;
            await post.save();
            res.json({ message: 'Post status updated successfully', post });

        } catch (error) {
            console.error('Error updating post status:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    })
]

//GET: get information for a single post
exports.admin_blogpost_get = asyncHandler(async(req,res,next)=>{  
    try {
        const postId = req.params.postId
        const post = await Post.findById(postId)
        const comments = await Comment.find({ post: postId }).populate({
            path: 'user',
            select: 'username' // Only include the username field
        })
        res.status(200).json({post:post , comments:comments})
    } catch(err) {
        res.status(500).json({message:"Internal server error"})
    }
})

//POST: update blog post and the data inside it
exports.admin_blogpost_update_post = [
    body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isString()
    .escape(),
    body("snippet")
    .trim()
    .isString()
    .escape(),
    body("content")
    .notEmpty().withMessage("Blogpost text content is required."),
    body("status")
    .trim()
    .notEmpty().withMessage('User type is required')
    .isIn(['Publish', "Don't Publish"]).withMessage("Invalid setting. Must be Publish or Don't Publish"),
    body("category.*").escape(), 

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req)
        const { title, snippet, content, status, category } = req.body
        const adminUserId = req.userId
        const postId = req.params.postId
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        } else {
            
            try {
                const cat = await Category.find({category: category})
                if (!cat) {
                    res.status(404).json({message: "Category does not exist, please create the category first"})
                }
                const updatedPost = {
                    title: title,
                    snippet: snippet,
                    content: content,
                    status: status,
                    author: adminUserId,
                    _id: postId
                }
                const blogpost = await Post.findByIdAndUpdate(postId, updatedPost, {new: true})
                await blogpost.save()

                if(!blogpost){
                    const error = new Error("Blog post not found")
                    error.status = 404
                    throw error
                }
                res.status(201).json(blogpost)
            } catch(err) {
                next(err)
            }
        }
    })
]

//DELETE: delete a post
exports.admin_blogpost_delete = asyncHandler(async(req,res,next)=>{ 
    const postId = req.params.postId; // Using req.params to get the postId from the URL
    try {
        const post = await Post.findById(postId); // Use findById to get a single post by its ID
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Delete the post
        await Post.findByIdAndDelete(postId)
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


//TODO: after finish category setting then come back here to check
//POST: create a category
exports.admin_category_post = [
    body("category")
        .trim()
        .notEmpty().withMessage('Category is required')
        .custom(async (value) => {
            const existingCat = await Category.findOne({ name: value.toLowerCase() });
            if (existingCat) {
                throw new Error("Category name must be unique");
            }
            return true;
        })
        .customSanitizer(value => value.toLowerCase())
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            const { category } = req.body;
            const newCategory = new Category({
                category: category
            });
            try {
                const savedCategory = await newCategory.save();
                res.status(201).json(savedCategory);
            } catch (err) {
                next(err);
            }
        }
    }
];


exports.admin_comments_get = asyncHandler(async(req,res,next)=>{
    const commentId = req.params.commentId
    const postId = req.params.postId
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


//DELETE: delete a specific comment
exports.admin_comments_delete = asyncHandler(async(req,res,next)=>{
    const commentId = req.params.commentId;
    try{
        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(404).json({ message: "Comment not found"})
        }
        await Comment.findByIdAndDelete(commentId)
        res.status(200).json({ message: "Comment deleted successfully"})
    } catch(error) {
        console.error("Error deleting comment: ", error);
        res.status(500).json({message: "Internal server error"})
    }
})

