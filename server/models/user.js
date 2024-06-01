const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true, minLength: 3},
    email: {type: String, required: true,
        lowercase: true, 
        unique: true, 
        validate: {
            validator: function(value){
                return  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            message: props => `${props.value} is not a valid email address`
        }},
    password: {type: String, required: true},
    userTypes: {
        User: {
            type: Number,
            default: 1987
        },
        Editor: Number,
        Admin: Number
    },
    refreshToken: String
})

UserSchema.virtual("url").get(function(){
    return `/user/${this._id}`
})

module.exports = mongoose.model("User", UserSchema)
