const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    post: {type: Schema.Types.ObjectId, ref: "Post", required: true},
    comment: {
        type: String,
        minLength: 3,
        required: true
    },
    date: {type: Date, default: Date.now},
    user: {type: Schema.Types.ObjectId, ref:"User",required:true}
})

const Comment = mongoose.model("Comment", CommentSchema)
module.exports = Comment