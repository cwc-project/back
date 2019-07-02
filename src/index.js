const app = require('./server')
const MongoClient = require('mongodb').MongoClient

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)
  })