const mongoose = require('mongoose')


if (process.argv.length === 4) {
  console.log('to add give password, name, number as arguments')
  process.exit(1)
}


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.2g5lns7.mongodb.net/personsApp?appName=Cluster0`
mongoose.connect(url)

if (process.argv.length === 3){
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => 
            console.log(`${person.name} ${person.number}`)
        )
        mongoose.connection.close()
    })
}


if (process.argv.length === 5){
    const argName = process.argv[3]
    const argNumber = process.argv[4]

    const person = new Person({
    name: argName,
    number: argNumber
    })

    person.save().then(result => {
    console.log(`added ${argName} number ${argNumber} to phonebook`)
    mongoose.connection.close()
    })
}



