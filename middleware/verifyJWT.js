const jwt = require("jsonwebtoken")

const verifyJWT = (req,res,next) =>{
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader?.startsWith("Bearer ")) return res.status(401).json({ "message": `"Error at verify JWT" ${JSON.stringify(req.headers)}`})
    const token = authHeader.split(" ")[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded) =>{
            if(err) return res.status(401).json({"message": "Error at verify JWT function"})
            req.user = decoded.UserInfo.username;
            req.userId = decoded.UserInfo.userId
            req.userTypes = decoded.UserInfo.userTypes;
            next()
        }
    )
}

module.exports = verifyJWT