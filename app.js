const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req, res) => {
  res.send('test')
})


app.listen(PORT, () => {
  console.log(`This server is now listening to http://localhost:${PORT}.`)
})
