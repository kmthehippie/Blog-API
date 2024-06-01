const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true},
    snippet: {type: String},
    content: {type: String, required: true},
    date: {type: Date, default: undefined},
    status: {type: String,
        required: true,
        enum: ["Publish", "Don't Publish"],
        default: "Publish"},
    imgurl: {type: [String], default: "https://images.pexels.com/photos/9669094/pexels-photo-9669094.jpeg"},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true}
})



const Post = mongoose.model("Post", PostSchema)
module.exports = Post