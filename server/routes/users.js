const router = require('express').Router()
const Query = require('../db')
const jwt = require('jsonwebtoken')
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { user_fname, user_lname, username, password } = req.body
    if (user_fname && user_lname && username && password) {
        try {
            let q = `select * from users where username = ?`
            let user = await Query(q, [username])
            if (!user.length > 0) {
                try {
                    let q = `INSERT INTO users(user_fname,user_lname,username,password)
                             VALUES(?,?,?,?)`
                    let salt = genSaltSync(10)
                    let hash = hashSync(password, salt)
                    await Query(q, [user_fname, user_lname, username, hash])
                    res.status(200).json({ error: false, msg: "user created successfully" })
                } catch (error) {
                    res.sendStatus(500)
                }

            } else {
                res.status(400).json({ error: true, msg: "username already exists" })
            }
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(401).json({ error: true, msg: "missing some info" })
    }
})
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (username, password) {
        try {
            let q = `select * from users where username = ?`
            let user = await Query(q, [username])
            if (user.length > 0) {
                if (compareSync(password, user[0].password)) {
                    let acess_token = jwt.sign(({ id: user[0].user_id, fname: user[0].user_fname, role: user[0].role }), "JlWkR", { expiresIn: "10m" })
                    res.status(200).json({ error: false, acess_token })
                } else {
                    res.status(401).json({ error: true, msg: "wrong password" })
                }
            } else {
                res.status(400).json({ error: true, msg: "wrong username" })
            }
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info.." })
    }
})








module.exports = router