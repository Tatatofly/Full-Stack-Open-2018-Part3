const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
  ]


morgan.token('content', function (req, res) { 
  return JSON.stringify(req['body']) })

app.use(express.static('build'))
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.content(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))
app.use(bodyParser.json())

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/info', (req, res) => {
  Person
  .find({})
  .then(person => {
    const persCount = person.length
    res.send('<div>Puhelinluettelossa on '+ persCount +' henkilön tiedot</div><br/><div>'+ new Date() +'</div>')
  })
  .catch(error => {
    console.log(error)
    res.status(404).end()
  })
})

app.get('/api/persons', (req, res) => {
  Person
  .find({})
  .then(person => {
    res.json(person.map(formatPerson))
  })
  .catch(error => {
    console.log(error)
    res.status(404).end()
  })
})

app.get('/api/persons/:id', (request, response) => {
    Person
    .findById(request.params.id)
    .then(person => {
      if(person){
        response.json(formatPerson(person))
      } else{
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'Malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
  .findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
   })
  .catch(error => {
    response.status(400).send({ error: 'Malformatted id' })
  })
})

const generateId = () => {
    return Math.floor(Math.random() * Math.floor(99999))
  }

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({error: 'Name or number missing'})
    }

    const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId()
    })
  
    person
      .save()
      .then(savedPerson => {
        response.json(formatPerson(savedPerson))
      })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = ({
    name: body.name,
    number: body.number,
  })

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => {
      response.json(formatPerson(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'Malformatted id' })
    })
})
    

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})