const User = require("../models/user");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.handle_refresh_token = asyncHandler(async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ "message": "Error. Cookies do not exist for refresh token." });
    }

    const refreshToken = cookies.jwt;
    try {
        // Verify if the refresh token is valid and not expired
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Find the user associated with the refresh token
        const user = await User.findOne({ refreshToken }).exec();
        if (!user) {
            return res.status(401).json({ "message": "Error. There is no user with this refresh token" });
        }
        
        // Ensure that the username in the token matches the user's username
        if (user.username !== decoded.UserInfo.username) {
            return res.status(401).json({ "message": "Error. User's username does not match decoded username" });
        }

        //Generate data for response
        const username = user.username
        const userId = user._id
        // Generate a new access token
        const userTypes = user.userTypes ? Object.values(user.userTypes).filter(Boolean) : [];
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": user.username,
                    "userId": user._id,
                    "userTypes": userTypes
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        // Return the new access token
        res.json({ username, userId, userTypes, accessToken });
    } catch (error) {
        // If there's an error with token verification, handle it appropriately
        return res.status(401).json({ "message": "Error verifying refresh token." });
    }
});
