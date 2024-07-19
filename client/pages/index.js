import React, { useEffect, useState } from 'react'

function index() {

  const [message, setMessage] = useState('Cargando...');
  const [mejorserver, setMejorserver] = useState([]);  
  useEffect(() => {
      fetch('http://localhost:8080/api/home').then(
        res => res.json()
      ).then(data => {
        console.log(data);
        setMessage(data.message);
        setMejorserver(data.mejorserver);
      })
  }, [])

  return (
    <div>
      <div>{message}</div>
      {
        mejorserver.map((server, index) => {
          return <div key={index}>{server}</div>
        })
      }

    </div>
    
  )
}

export default index