require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('dist'))

app.get('/info', (request, response) => {
    const date =  new Date().toLocaleString();
    response.send(`
        <h1>Phonebook has info for ${Person.countDocuments({})} people</h1>
        <h1>${date}</h1>`
    )
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const generateID = () => {
    return String(Number.MAX_SAFE_INTEGER * Math.random())
}

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body)
        return response.status(400).json({
            error: 'content missing'
    })

    if (!body.name)
        return response.status(400).json({
            error: 'name missing'
    })

    if (!body.number)
        return response.status(400).json({
            error: 'number missing'
    })

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson   )
    })
})

    app.put('/api/persons/:id', (request, response) => {
        const id = request.params.id
        const body = request.body

        if (!body.name || !body.number) {
            return response.status(400).json({
                error: 'name or number missing'
            })
        }

        const personIndex = persons.findIndex(person => person.id === id)
        if (personIndex === -1) {
            return response.status(404).json({
                error: 'person not found'
            })
        }

        const updatedPerson = {
            ...persons[personIndex],
            name: body.name,
            number: body.number
        }

        persons[personIndex] = updatedPerson
        response.json(updatedPerson)
    })


const PORT =  process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})