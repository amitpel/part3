require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const app = express()


app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
//app.use(express.static('dist'))

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date().toLocaleString()
      response.send(`
        <h1>Phonebook has info for ${count} people</h1>
        <h1>${date}</h1>
      `)
    })
    .catch(next)
})


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person)
        response.json(person)
      else
        response.status(404).end()
    })
    .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(next)
})


app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  if (!name)  return res.status(400).json({ error: 'name missing' })
  if (!number) return res.status(400).json({ error: 'number missing' })

  new Person({ name, number })
    .save()
    .then(saved => res.status(201).json(saved))
    .catch(next)
})


app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, context: 'query' }
  )
    .then(updated => updated ? res.json(updated) : res.status(404).json({ error: 'person not found' }))
    .catch(next)
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') return res.status(400).json({ error: 'malformatted id' })
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message })
  console.error(err)
  res.status(500).json({ error: 'internal server error' })
}


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT =  process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})