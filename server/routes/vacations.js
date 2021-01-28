const router = require('express').Router()
const Query = require('../db')
const { verifyAdmin, verifyUser } = require('../verify')
const followSorter = require('../followed')

// get the followed vacation from left to right, if nothing is followed returns them in default order
const getVacations = async (userId) => {
    try {
        let q1 = `SELECT * FROM followedvacations WHERE user_id = ?`
        let q2 = `SELECT * FROM vacations`
        let followedVacations = await Query(q1, [userId])
        let vacations = await Query(q2, [])
        if (followedVacations.length > 0) {
            let filterArr = followedVacations.map(vacation => vacation.vacation_id)
            let notFollowedVacations = vacations.filter(v => !filterArr.includes(v.vacation_id))
            let userFollowedVacations = vacations.filter(v => filterArr.includes(v.vacation_id))
            userFollowedVacations.map(v => v['isfollowed'] = true)
            let results = [...userFollowedVacations, ...notFollowedVacations]
            return results
        } else {
            return vacations
        }
    } catch (error) {
    }
}

router.get("/", verifyUser, async (req, res) => {
    try {
        let vacations = await getVacations(req.user.id)
        res.send(vacations)
    } catch (error) {
        res.sendStatus(500)
    }
})
//add vacation
router.post('/add', verifyAdmin, async (req, res) => {
    const { vacation_description, vacation_destination, vacation_image, vacation_fromDate, vaction_toDate, vacation_price } = req.body
    if (vacation_description && vacation_destination && vacation_image && vacation_fromDate && vaction_toDate && vacation_price) {
        try {
            let q = `INSERT INTO vacations (vacation_description, vacation_destination,vacation_image,vacation_fromDate, vaction_toDate,vacation_price )
                 VALUES (?,?,?,?,?,?)`
            await Query(q, [vacation_description, vacation_destination, vacation_image, vacation_fromDate, vaction_toDate, vacation_price])
            let vacations = await getVacations(req.user.id)
            res.send(vacations)
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }

})
//delete vacation
router.delete('/delete', verifyAdmin, async (req, res) => {
    const { vacation_id } = req.body
    if (vacation_id) {
        let q = `SELECT * FROM vacations WHERE vacation_id = ?`
        let vacation = await Query(q, [vacation_id])
        if (vacation.length > 0) {
            try {
                let q1 = `DELETE FROM followedvacations WHERE vacation_id = ?`
                let q2 = `DELETE FROM vacations WHERE vacation_id = ?`
                await Query(q1, [vacation_id])
                await Query(q2, [vacation_id])
                let vacations = await getVacations(req.user.id)
                res.send(vacations)
            } catch (error) {
                res.sendStatus(500)
            }
        } else {
            res.status(400).json({ error: true, msg: "no such vacation please check the id" })
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })

    }
})
//update vacation
router.put('/update/:id', verifyAdmin, async (req, res) => {
    const { vacation_description, vacation_destination, vacation_image, vacation_fromDate, vaction_toDate, vacation_price } = req.body
    if (vacation_description && vacation_destination && vacation_image && vacation_fromDate && vaction_toDate && vacation_price && req.params.id) {
        let q = `SELECT * FROM vacations WHERE vacation_id = ?`
        let vacation = await Query(q, [req.params.id])
        if (vacation.length > 0) {
            try {
                let q = `UPDATE vacations SET vacation_description = ?, vacation_destination = ?, vacation_image = ?, vacation_fromDate = ?,vaction_toDate = ?,vacation_price = ?  WHERE vacation_id = ?`
                await Query(q, [vacation_description, vacation_destination, vacation_image, vacation_fromDate, vaction_toDate, vacation_price, req.params.id])
                let vacations = await getVacations(req.user.id)
                res.send(vacations)
            } catch (error) {
                res.sendStatus(500)
            }
        } else {
            res.status(400).json({ error: true, msg: "no such vacation please check the id" })
        }

    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})
// follow/unfollow
router.get('/follow/:id', verifyUser, async (req, res) => {
    try {
        let q = `SELECT * FROM vacations WHERE vacation_id = ?`
        let vacation = await Query(q, [req.params.id])
        if (vacation.length > 0) {
            try {
                let q = `SELECT * FROM followedvacations WHERE user_id = ? AND vacation_id = ? `
                let followedVacations = await Query(q, [req.user.id, req.params.id])
                //follow
                if (!followedVacations.length > 0) {
                    try {
                        let q1 = `INSERT INTO followedvacations(user_id, vacation_id)
                        VALUES(?, ?)`
                        let q2 = `UPDATE vacations set vacation_followers = vacation_followers + 1 WHERE vacation_id = ?`
                        await Query(q1, [req.user.id, req.params.id])
                        await Query(q2, [req.params.id])
                        let vacations = await getVacations(req.user.id)
                        res.send(vacations)
                    } catch (error) {
                        res.sendStatus(500)
                    }
                } else {
                    //unfollow
                    try {
                        let q1 = `DELETE FROM  followedvacations WHERE user_id= ? AND vacation_id = ?`
                        let q2 = `UPDATE vacations set vacation_followers = vacation_followers - 1 WHERE vacation_id = ?`
                        await Query(q1, [req.user.id, req.params.id])
                        await Query(q2, [req.params.id])
                        let vacations = await getVacations(req.user.id)
                        res.send(vacations)
                    } catch (error) {
                        res.sendStatus(500)
                    }
                }
            } catch (error) {
                res.sendStatus(500)
            }
        } else {
            res.status(400).json({ error: true, msg: "wrong vacation id" })
        }
    } catch (error) {
        res.sendStatus(500)
    }
})

//search vacation
router.post('/search', verifyUser, async (req, res) => {
    let q = `SELECT * FROM followedvacations WHERE user_id = ?`
    let followedVacations = await Query(q, [req.user.id])
    if (req.body) {
        const { keywords, date, toDate } = req.body
        // all search params 
        if (keywords && date && toDate) {
            try {
                // let q = `select * from vacations WHERE vacation_description like "%${keywords}%" AND vacation_fromDate LIKE "%${date}%"`
                let q = `select * from vacations WHERE vacation_description like "%${keywords}%" AND vacation_fromDate >= "${date}" AND vaction_toDate <= "${toDate}"`
                let vacations = await Query(q, [])
                if (followedVacations.length > 0) {
                    let results = await followSorter(followedVacations, vacations)
                    res.json(results)
                } else {
                    res.json(vacations)
                }
            } catch (error) {
                res.sendStatus(500)
            }
            //search only description 
        } else if (keywords && !date) {
            try {
                let q = `select * from vacations WHERE vacation_description like "%${keywords}%"`
                let vacations = await Query(q, [])
                if (followedVacations.length > 0) {
                    let results = await followSorter(followedVacations, vacations)
                    res.json(results)
                } else {
                    res.json(vacations)
                }
            } catch (error) {
                res.sendStatus(500)
            }
            //search only dates
        } else if (toDate && date && !keywords) {
            try {
                let q = `select * from vacations WHERE vacation_fromDate >= "${date}" AND vaction_toDate <= "${toDate}"`
                let vacations = await Query(q, [])
                console.log(vacations)
                if (followedVacations.length > 0) {
                    let results = await followSorter(followedVacations, vacations)
                    res.json(results)
                } else {
                    res.json(vacations)
                }
            } catch (error) {
                res.sendStatus(500)
            }
        } else {
            res.status(400).json({ error: true, msg: "Missing some info.." })
        }
    }
})
//get charts
router.get('/chart', verifyAdmin, async (req, res) => {
    try {
        let q = `SELECT * FROM vacations WHERE vacation_followers > 0`
        let vacations = await Query(q, [])
        console.log(vacations)
        res.send(vacations)
    } catch (error) {
        res.status(500).json({ error: true, msg: 'server error' })
    }
})
module.exports = router