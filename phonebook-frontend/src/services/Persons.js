import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = newPerson => {
  return axios.post(baseUrl, newPerson).then(response => response.data)
}

const DeletePerson = id => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const update = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${updatedPerson.id}`, updatedPerson).then(response => response.data)
}

export default  { getAll, create, DeletePerson, update }