const apiError = require('../utils/apiError')
function createAuthMiddleware({security}){
    return (req, res, next)=>{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!authHeader) {
            return next(
                apiError(401, 'UNAUTHORIZED', 'Token not found')
            );
        }
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Access Denied: No Token Provided'
            })
        }

        try{
            const verified = security.verifyToken(token)
            if (!verified) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: Invalid or expired token'
                })
            }
            req.user = verified
            next()
        } catch (error){
            res.status(403).json({
                success: false,
                message: 'Invalid Token'
            })
        }
    }
}

module.exports = createAuthMiddleware