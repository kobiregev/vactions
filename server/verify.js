const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const verifyUser = (req, res, next) => {
    // has token
    if (req.header("Authorization")) {
        // if token valid
        jwt.verify(req.header("Authorization"), "JlWkR", (err, user)=>{
            if(err){
                res.status(403).json({ error: true, msg: "token not valid",errorType:"Token" })
            }else{
                req.user = user
                next()
            }
        })
    } else {
        res.status(401).json({ error: true, msg: "token expected", errorType:"Token" })
    }
}

const verifyAdmin = (req, res, next) => {
        // has token
        if (req.header("Authorization")) {
            // if token valid
            jwt.verify(req.header("Authorization"), "JlWkR", (err, user)=>{
                if(err){
                    res.status(403).json({ error: true, msg: "token not valid",errorType:"Token" })
                }else{
                    // is admin?
                    if(user.role === "admin"){
                        req.user = user
                        next()
                    }else{
                        res.status(403).json({ error: true, msg: "your still not an admin, try next year",errorType:"Token" })
                    }
                }
            })
        } else {
            res.status(401).json({ error: true, msg: "token expected",errorType:"Token" })
        }
}

module.exports = { verifyAdmin, verifyUser }