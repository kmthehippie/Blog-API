

const correctRoute = async(req,res,next)=>{
    const idOnParams = req.params.userId
    if(idOnParams !== req.userId){
        return res.status(403).json({message: "Forbidden at correctRoute"})
    } else {
        next()
    }
}

module.exports = correctRoute