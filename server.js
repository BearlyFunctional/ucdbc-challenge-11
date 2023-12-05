const express = require('express')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
)

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
)

app.delete('/api/notes/:id', (req, res) => {
  let newDataBase = JSON.parse(fs.readFileSync('./db/db.json'))
  const targetId = req.params.id
  const targetIndex = newDataBase.findIndex(o => o.id === targetId)
  newDataBase.splice(targetIndex, 1)
  fs.writeFile('./db/db.json', JSON.stringify(newDataBase), (err) => {
    if (err) {console.log(err)}
  })
  const response = 'Note Deleted.'
  res.status(201).json(response)
})

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body
  if (title && text) {
    const newNote = {
      title: title,
      text: text,
      id: uuid()
    }
    const dataBase = fs.readFileSync('./db/db.json')
    const newDataBase = JSON.parse(dataBase)
    newDataBase.push(newNote)
    fs.writeFile('./db/db.json', JSON.stringify(newDataBase), (err) => {
      if (err) {console.log(err)}
    })
    const response = {
      status: 'success',
      body: newNote
    }
    res.status(201).json(response)
  } else {
    res.status(500).json('Unable to save note')
  }
})

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
)

const uuid = () => 

  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);