const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.urlencoded({extended: false}))

const Exercises = []
const Users = []

app.post('/api/users', (req, res) => {
  const { username } = req.body

  const userObject = {
    username,
    _id: Users.length.toString()
  }

  Users.push(userObject)

  return res.json(userObject)

})

app.get('/api/users', (req, res) => {
  return res.json(Users)
})

const userFinderMiddleware = (req, res, next) => {
  const user = Users.find((user) => user._id === req.params.id)
  req.user = user
  next()
}

app.post('/api/users/:id/exercises', userFinderMiddleware , (req, res) => {
  const description = req.body.description
  const duration = Number(req.body.duration)
  const date = req.body['date'] || new Date(Date.now()).toDateString()

  const exerciseObject = {
    username: req.user.username,
    description,
    duration,
    date,
    _id: req.user._id
  }

  Exercises.push(exerciseObject)

  return res.json(exerciseObject)

})

app.get('/api/users/:id/logs', userFinderMiddleware, (req, res) => {

  const from = req.query['from']
  const to = req.query['to']
  const limit = req.query['limit']

  console.log(from, to, limit)

  let exerciseList = Exercises.filter((ex) => {
    return ex._id === req.user._id
  })

  if(from || to) {
    exerciseList = exerciseList.filter((ex) => {
      return Date(ex.date) >= Date(from) && Date(ex.date) <= Date(to)
    })
  }

  if(limit) {
    exerciseList = exerciseList.slice(0, Number(limit))
  }

  return res.json({
    count: exerciseList.length,
    log: exerciseList
  })  

})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
