import { useState, useEffect } from 'react'
import './App.css'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PersonsService from './services/Persons'
import Notification from './components/Notiflication'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
  const [notiflication, setNotification] = useState({content: null, type: null})

  useEffect(() => {
    PersonsService.getAll().then(initialPersons => {
      setPersons(initialPersons)
      setFilteredPersons(initialPersons)
    })
  },[])


  const addPerson = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)
    if (names.includes(newName)){
      if(window.confirm(`${newName} is already added to phonebook, do you want to update the number?`))
      {
        const personToUpdate = persons.find(person => person.name === newName)
        const updatedPerson = {...personToUpdate, number: newNumber}
        PersonsService.update(personToUpdate.id, updatedPerson).then(returnedPerson => {
          const updatedPersons = persons.map(person => person.id !== personToUpdate.id ? person : returnedPerson)
          setPersons(updatedPersons)
          setFilteredPersons(updatedPersons)
          setNewName('')
          setNewNumber('')
          const notificationObj = {
            content: `Updated ${returnedPerson.name}'s number successfully`,
            type: 'success'
          }
          setNotification(notificationObj)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
      }
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1)
      }

      PersonsService.create(personObject).then(returnedPerson => {
        const updatedPersons = persons.concat(returnedPerson)
        setPersons(updatedPersons)
        setFilteredPersons(updatedPersons)
        setNewName('')
        setNewNumber('')
        const notificationObj = {
          content: `Added ${returnedPerson.name} successfully`,
          type: 'success'
        }
        setNotification(notificationObj)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error)
        setNotification({
          content: error.response.data.error || error.message,
          type: "error"
        })
        setTimeout(() => {
        setNotification(null)
      }, 5000)}
      )
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const changeFilter = (event) => {
    setFilter(event.target.value)
    const filtered = persons.filter(person => 
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    )
    setFilteredPersons(filtered)
  }

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this person?")) {
    PersonsService.DeletePerson(id).then(() => {
      const updatedPersons = persons.filter(person => person.id !== id)
      setPersons(updatedPersons)
      setFilteredPersons(updatedPersons)
      const notificationObj = {
        content: `Deleted person successfully`,
        type: 'success'
      }
      setNotification(notificationObj)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }).catch(error => {
      const notificationObj = {
        content: `Information of the person has already been removed from server`,
        type: 'error'
      }
      setNotification(notificationObj)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      const updatedPersons = persons.filter(person => person.id !== id)
      setPersons(updatedPersons)
      setFilteredPersons(updatedPersons)
    })
  }
  }

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={notiflication} />
      <Filter changeFilter={changeFilter} filter={filter}/>
      <h3>Add a new</h3>
      <PersonForm   
        addPerson={addPerson} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h3>Numbers</h3>
      <Persons   filteredPersons={filteredPersons} handleDelete={handleDelete}/>
    </>
  )
}

export default App