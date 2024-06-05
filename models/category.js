const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category: {
        type: String,
        unique: true,
        lowercase: true
    }
})

const Category = mongoose.model("Category", CategorySchema)
module.exports = Category