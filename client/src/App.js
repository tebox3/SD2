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
  const [resp, setResp] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [endgame, setendgame] = useState(true);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState([]);
  const [respuestaEnviada, setRespuestaEnviada] = useState(false);
  const [terminado, setTerminado] = useState(true);
  const [codigoOriginal, setCodigoOriginal] = useState('');
  const [codigoAnfitrionCorrecto, setCodigoAnfitrionCorrecto] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [showCorrectButton, setShowCorrectButton] = useState(preguntas.map(() => true));

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
    if (roleSelected === 'Anfitrion') {
      const response = await fetch('/codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigoAnfitrion }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setverificarAnfitrion(true)
          setCodigoOriginal(data.codigo)
          setCodigoAnfitrion(data.codigo)
        } else {
          console.log('Error');
          setCodigoAnfitrionCorrecto(true)
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
    const response = await fetch('/preguntas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigo }),
    });
    const data = await response.json();
    setData(data);
  };

  const addRespuesta = (index) => {
    setPreguntas(preguntas.map((pregunta, i) => (
      i === index && pregunta.respuestas.length < 5 
        ? { ...pregunta, respuestas: [...pregunta.respuestas, ''] } 
        : pregunta
    )));
  };

  const addRespuestaCorrecta = (preguntaIndex, respuestaIndex) => {
    setRespuestaCorrecta(prevRespuestaCorrecta => prevRespuestaCorrecta.concat(respuestaIndex));
    setShowCorrectButton(showCorrectButton.map((show, index) => index === preguntaIndex ? false : show));
  };

  const enviarRespuestaCorrecta = async () => {
    const response = await fetch('/recibir_respuestas_correctas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resCorrectas }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        console.log("RESPUESTAS CORRECTAS ENVIADA CORRECTAMENTE")
      } else {
        console.log('Error');
      }
    } else {
      console.log('Error en la solicitud');
    }
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
    setShowCorrectButton([...showCorrectButton, true]);
  };

  const TerminarJuego = async () => {
    const response = await fetch('/terminar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigoAnfitrion }),
    });
    if (response.ok) {
      const data = await response.json();
      setendgame(false);
      setTerminado(false);
      setResultados(data);
    } else {
      console.log('Error en la solicitud');
    }
  };

  const respuestasFinal = {
    "resp": resp,
    "codigo": codigo
  };

  const resCorrectas = {
    "resp": respuestaCorrecta,
    "codigo": codigoAnfitrion
  };

  const mandarRespuestas = async () => {
    const response = await fetch('/recibir_respuestas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ respuestasFinal }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setendgame(false);
        console.log("RESPUESTAS ENVIADAS CORRECTAMENTE, FIN DEL JUEGO");
      } else {
        console.log('Error');
      }
    } else {
      console.log('Error en la solicitud');
    }
  };

  const preguntas_respuestas = {
    "preguntas": preguntas,
    "codigo": codigoAnfitrion
  };

  const handleSubmitFormulario = async () => {
    const response = await fetch('/ingresar_respuesta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preguntas_respuestas }),
    });
    const data = await response.json();
    setVerificarPreguntas(false);
    setRespuestaEnviada(true);
    enviarRespuestaCorrecta();
    console.log("PREGUNTAS enviadas");
  };

  useEffect(() => {
    if (roleSelected === 'Alumno') {
      fetchData();
    }
  }, [roleSelected]);

  const handleAnswerClick = (respuestaIndex) => {
    setResp(prevResp => {
      const newResp = [...prevResp];
      newResp[currentQuestionIndex] = respuestaIndex;
      return newResp;
    });

    if (currentQuestionIndex + 1 < data.preguntas.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowEndScreen(true);
    }
  };

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
            <p>PREGUNTAS</p>
            {showEndScreen ? (
              <div>
                {endgame ? (
                  <div>
                    <p>Fin de las preguntas</p>
                    <button onClick={mandarRespuestas}>Enviar respuestas</button>
                  </div>
                ) : (
                  <p>Fin del juego, espera respuestas de tu anfitrion.</p>
                )}
              </div>
            ) : (
              data && data.preguntas && data.preguntas.length > 0 && (
                <div>
                  <p>Pregunta {currentQuestionIndex + 1}: {data.preguntas[currentQuestionIndex].pregunta}</p>
                  <ul>
                    {data.preguntas[currentQuestionIndex].respuestas.map((respuesta, respuestaIndex) => (
                      <li 
                        key={respuestaIndex}
                        onClick={() => handleAnswerClick(respuestaIndex)}
                        style={{ 
                          cursor: 'pointer', 
                          fontWeight: resp[currentQuestionIndex] === respuestaIndex ? 'bold' : 'normal' 
                        }}
                      >
                        {respuesta}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        )
      ) : roleSelected === 'Anfitrion' ? (
        <div>
          {!verificarAnfitrion ? (
            <div>
              <input
                type="text"
                value={codigoAnfitrion}
                onChange={(e) => setCodigoAnfitrion(e.target.value)}
                placeholder="Codigo"
              />
              <button onClick={codigoAnfitrionFunc}>Enviar</button>
              {codigoAnfitrionCorrecto && (
              <p>Codigo incorrecto, recarga la pagina e intente nuevamente</p>
            )}
            </div>
          ) : verificarPreguntas ? (
            <div>
              <h1>Codigo: {codigoOriginal}</h1>
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
                      {showCorrectButton[index] && (
                        <button onClick={() => addRespuestaCorrecta(index, rIndex)}>Correcta</button>
                      )}
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
          ) : terminado ? (
            <div>
              <h1>Codigo: {codigoOriginal}</h1>
              <h1>¿Terminar sesion?</h1>
              <button onClick={TerminarJuego}>Terminar</button>
            </div>
          ) : (
            <div>
              <h1>Respuestas correctas</h1>
              {resultados.map((respuesta, rIndex) => (
                <div key={rIndex}>
                  <p>Pregunta {rIndex + 1}: {respuesta}</p>
                </div>
              ))}
            </div>
          )}
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