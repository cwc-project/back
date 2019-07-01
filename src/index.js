const app = require('./server')
const MongoClient = require('mongodb').MongoClient

const port = process.env.PORT || 9000

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
  })