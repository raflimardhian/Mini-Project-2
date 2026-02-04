function checkRole(allowedRoles){
    return (req, res, next)=>{
        if(!req.user){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Please Login First'
            })
        }

        if(allowedRoles.includes(req.user.role)){
            next()
        } else{
            res.status(403).json({
                success: false,
                message: 'Forbidden: You are not allowed'
            })
        }
    }
}

module.exports = checkRole