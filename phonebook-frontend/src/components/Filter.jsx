import React from "react";

const  Filter = ({changeFilter,filter}) =>  {
  return (
    <>filter <input type="text" onChange={changeFilter} value={filter}></input></>
  )
}

export default Filter