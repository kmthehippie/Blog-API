const JWTStrategy = require("passport-jwt").Strategy
const extractJWT = require("passport-jwt").ExtractJwt

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET
}

module.exports = new JWTStrategy(opts, (jwt_payload, done)=>{
})