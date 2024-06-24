const verifyUserType = (...allowedUserType) =>{
    return (req,res,next) =>{
       
        if(!req?.userTypes) return res.status(401).json({"message": "No UserType in Req"})
        const userTypeArray = [...allowedUserType]
        const result = req.userTypes
        .map( userTypes => userTypeArray.includes(userTypes))
        .find(val => val === true)
        if (!result) {
            return res.status(401).json({"message": `There is no result in finding request usertype ${req.userTypes}`})
            
        }next()
    }
}

module.exports = verifyUserType