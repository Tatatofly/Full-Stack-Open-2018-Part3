const mongoose = require('mongoose')

const url = 'mongodb://stackuser:<password>@ds147033.mlab.com:47033/persons'

mongoose.connect(url)

console.log('person.js')

const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: String
})

module.exports = Person