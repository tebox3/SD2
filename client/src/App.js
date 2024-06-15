import React, { useState, useEffect } from 'react';


function App() {
  const [codigo, setCodigo] = useState('');
  const [codigoAnfitrion, setCodigoAnfitrion] = useState('');
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [roleSelected, setRoleSelected] = useState('');
  const [codigoInvalido, setCodigoInvalido] = useState(false);
  const [verificarAnfitrion, setverificarAnfitrion] = useState(false);
  const [preguntas, setPreguntas] = useState([{ pregunta: '', respuestas: ['', ''] }]);
  const [verificarPreguntas, setVerificarPreguntas] = useState(true);

  const handleNameSubmit = async () => {
    if (roleSelected === 'Alumno') {
      const response = await fetch('/codigo_respuesta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNameSubmitted(true);
          setCodigoInvalido(false);
          fetchData();
        } else {
          setCodigoInvalido(true);
          console.log('Error, codigo incorrecto');
        }
      } else {
        console.log('Error en la solicitud');
      }
    }
  };

  const codigoAnfitrionFunc = async () => {
    console.log("SSSSSSSS")
    if (roleSelected === 'Anfitrion') {
      const response = await fetch('/codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigoAnfitrion }),
      });
      console.log("SSSSSSSS")
      if (response.ok) {
        console.log("SSSSSSSS")
        const data = await response.json();
        if (data.success) {
          console.log("SSSSSSSS")
          setverificarAnfitrion(true)
        } else {
          console.log('Error');
        }
      } else {
        console.log('Error en la solicitud');
      }
    }
    
  };


  const handleRoleSelection = async (role) => {
    setRoleSelected(role);
  };

  const fetchData = async () => {
    console.log('AA')
    const response = await fetch('/preguntas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigo }),
    });
    console.log('BB')
    const data = await response.json();
    console.log('CC')
    console.log(data)
    console.log(roleSelected)
    console.log('DD')
    setData(data);
  };

  const addRespuesta = (index) => {
    setPreguntas(preguntas.map((pregunta, i) => (
      i === index && pregunta.respuestas.length < 5 
        ? { ...pregunta, respuestas: [...pregunta.respuestas, ''] } 
        : pregunta
    )));
  };

  const handlePreguntaChange = (index, value) => {
    setPreguntas(preguntas.map((pregunta, i) => (
      i === index ? { ...pregunta, pregunta: value } : pregunta
    )));
  };

  const handleRespuestaChange = (pIndex, rIndex, value) => {
    setPreguntas(preguntas.map((pregunta, i) => (
      i === pIndex 
        ? { 
            ...pregunta, 
            respuestas: pregunta.respuestas.map((respuesta, j) => (
              j === rIndex ? value : respuesta
            )) 
          }
        : pregunta
    )));
  };

  const addPregunta = () => {
    setPreguntas([...preguntas, { pregunta: '', respuestas: ['', ''] }]);
  };


  const preguntas_respuestas = {
    "preguntas": preguntas,
    "codigo": codigoAnfitrion
  };

  const handleSubmitFormulario = async () => {
    // Lógica para enviar las preguntas y respuestas
    console.log(preguntas)
    console.log(preguntas_respuestas.preguntas)
    const response = await fetch('/ingresar_respuesta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preguntas_respuestas }),
    });
    const data = await response.json();
    setVerificarPreguntas(false)
    console.log("PREGUNTAS enviadas")
  };


  useEffect(() => {
    if (roleSelected === 'Alumno') {
      fetchData();
    }
  }, [roleSelected]);

  return (
    <div>
      {!roleSelected ? (
        <div>
          <button onClick={() => handleRoleSelection('Alumno')}>Alumno</button>
          <button onClick={() => handleRoleSelection('Anfitrion')}>Anfitrión</button>
        </div>
      ) : null}
      {roleSelected === 'Alumno' ? (
        !nameSubmitted ? (
          <div>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Introduce el codigo dado por el anfitrion"
            />
            <button onClick={handleNameSubmit}>Enviar</button>
            {codigoInvalido && (
              <p>Codigo incorrecto, recarga la pagina e intente nuevamente</p>
            )}
          </div>
        ) : (
          <div>
            {console.log("DATA: ", data)}
            <p>PREGUNTAS</p>
            {data && Object.keys(data).length > 0 ? (
              Object.keys(data).map((key, index) => (
                <div key={index}>
                  <p>{key}:</p>
                  {Array.isArray(data[key]) ? (
                    data[key].map((item, subIndex) => (
                      <p key={subIndex}>{item} : {subIndex} : {key}</p>
                    ))
                  ) : (
                    <p>No hay datos disponibles.</p>
                  )}
                </div>
    ))
  ) : (
    <p>No hay preguntas disponibles.</p>
  )}
</div>

        )
      ) : roleSelected === 'Anfitrion' ? (
        <div>
        {
          !verificarAnfitrion ? (
            <div>
              <input
                type="text"
                value={codigoAnfitrion}
                onChange={(e) => setCodigoAnfitrion(e.target.value)}
                placeholder="Codigo"
              />
              <button onClick={codigoAnfitrionFunc}>Enviar</button>
            </div>
          ) : verificarPreguntas ? (
            <div>
              {preguntas.map((item, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={item.pregunta}
                    onChange={(e) => handlePreguntaChange(index, e.target.value)}
                    placeholder="Introduce la pregunta"
                  />
                  {item.respuestas.map((respuesta, rIndex) => (
                    <div key={rIndex}>
                      <input
                        type="text"
                        value={respuesta}
                        onChange={(e) => handleRespuestaChange(index, rIndex, e.target.value)}
                        placeholder={`Respuesta ${rIndex + 1}`}
                      />
                    </div>
                  ))}
                  {item.respuestas.length < 5 && (
                    <button onClick={() => addRespuesta(index)}>Agregar otra respuesta</button>
                  )}
                </div>
              ))}
              <button onClick={addPregunta}>Agregar otra pregunta</button>
              <button onClick={handleSubmitFormulario}>Enviar Preguntas y Respuestas</button>
            </div>
          ):null
        }  
        </div>
      ) : null}
    </div>
  );
}





export default App;


/* 
return (
    <div>
      {!roleSelected ? (
        <div>
          <button onClick={() => handleRoleSelection('Alumno')}>Alumno</button>
          <button onClick={() => handleRoleSelection('Anfitrion')}>Anfitrión</button>
        </div>
      ) : roleSelected === 'Alumno' ? (
        !nameSubmitted ? (
          <div>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Introduce el codigo dado por el anfitrion"
            />
            <button onClick={handleNameSubmit}>Enviar</button>
            {codigoInvalido && (
              <p>Codigo incorrecto, recarga la pagina e intente nuevamente</p>
            )}
          </div>
        ) : (
          <div>
            {data && data.length > 0 ? (
              data.map((member, i) => (
                <p key={i}>{member}</p>
              ))
            ) : (
              <p>No hay preguntas disponibles.</p>
            )}
          </div>
        )
      ) : roleSelected === 'Anfitrion' ? (
          roleSelected === 'Anfitrion' ? (
        <div>
            <input
              type="text"
              value={codigoAnfitrion}
              onChange={(e) => setCodigoAnfitrion(e.target.value)}
              placeholder="Codigo"
            />
            <button onClick={codigoAnfitrionFunc}>Enviar</button>
            {console.log(verificarAnfitrion)}
          </div>
      ) : verificarAnfitrion ? (
        <div>
            <input
              type="text"
              value={codigoAnfitrion}
              onChange={(e) => setCodigoAnfitrion(e.target.value)}
              placeholder="AAQQWW"
            />
            <button onClick={codigoAnfitrionFunc}>rtrt</button>
          </div>
      ) : null ): null}
    </div>
  );  
}

*/