const express = require('express')
const router = express.Router()

router.get("/",(req,res)=>{
    res.send("Routing is in my Pocket now !")
})

module.exports = router