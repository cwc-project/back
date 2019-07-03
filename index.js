require('@babel/register')
require("dotenv").config()

exports = module.exports = require('./src')
// const express = require('express')
// const PORT = process.env.PORT || 5000

// express()
//  .get('/', (req, res) => {
//      res.send("hello")
//  })
//  .listen(PORT, () => console.log(`listen at: ${PORT}`))