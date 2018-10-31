const mongoose = require('mongoose')


const url = 'mongodb://stackuser:<password>@ds147033.mlab.com:47033/persons'

const generateId = () => {
    return Math.floor(Math.random() * Math.floor(99999))
  }

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  id: String
})

if(process.argv[2] && process.argv[3]){
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3],
        id: generateId()
    })
    
    person
      .save()
      .then(response => {
        console.log(`Lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
        mongoose.connection.close()
      })
} else {
    console.log('Puhelinluettelo: ')
    Person
        .find({})
        .then(result => {
          result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
          })
          mongoose.connection.close()
    })
}