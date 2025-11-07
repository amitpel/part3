import React from "react";

const Person = ({ person, handleDelete }) => {
    return (
      <><li>{person.name}, {person.number}</li><button onClick={() => handleDelete(person.id)}>delete</button></>
    )
  }
  
export default Person