if (process.env.NODE_ENV === "development") require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const index = require("./routes/index")


app.use(express.urlencoded({ extended:false }))
app.use(express.json())
app.use(cors())
app.use(index)

app.use(function (error, req, res, next) {
  console.log(error)
  res.json({
    message: error.message
  })
})


app.listen(process.env.PORT || 3000, _ => console.log(`Server online on port ${process.env.PORT || 3000}`))