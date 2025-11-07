const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
let persons = [
        { 
            "id": "1",
            "name": "Arto Hellas", 
            "number": "040-123456"
        },
        { 
            "id": "2",
            "name": "Ada Lovelace", 
            "number": "39-44-5323523"
        },
        { 
            "id": "3",
            "name": "Dan Abramov", 
            "number": "12-43-234345"
        },
        { 
            "id": "4",
            "name": "Mary Poppendieck", 
            "number": "39-23-6423122"
        }
]

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/info', (request, response) => {
    const date =  new Date().toLocaleString();
    response.send(`
        <h1>Phonebook has info for ${persons.length} people</h1>
        <h1>${date}</h1>`
    )
})


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === request.params.id)
    if (person)
        response.json(person)
    else
        response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== request.params.id)
    response.status(204).end()
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

    if(persons.filter(person => person.name === body.name).length > 0)
        return response.status(400).json({
            error: "name must be unique"
    })

    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
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