const express = require('express')
const app = express();
const db = require('./db')
const cors = require('cors')


app.use(express.json())
app.use(cors())
app.use("/users", require('./routes/users'))
app.use('/vacations', require('./routes/vacations'))

app.get("/", (req, res) => {
    res.send("Hey :)")
})

app.listen(1000, () => {
    console.log("runing on port 1000")
})