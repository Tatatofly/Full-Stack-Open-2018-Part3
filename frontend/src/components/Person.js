import React from 'react'

const Person = ({ persons, filter, deleteName }) => {
  const pplToShow = 
    filter.length === 0 ?
      persons:
      persons.filter(persons => persons.name.startsWith(filter))

  return (
    pplToShow.map(person => <li key={person.name}>{person.name} {person.number} <button onClick={() => deleteName(person.id)}>Poista</button></li>)
  )
}

export default Person