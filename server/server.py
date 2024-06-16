from flask import Flask, request, jsonify
import time

app = Flask(__name__)
codigos = {}
respuestas = {}
correctas = {}
correctas_sumadas = {}
@app.route("/home", methods=["POST","GET"])
def home():
    if request.method == "POST":
        name = request.json.get("codigo")
        print(f"Codigo recibido: {name}")
        #Falat agregar condicion si es correct o si es incorrecto
        return jsonify(success=True)
    elif request.method == "GET":
        time.sleep(10)
        return {"preguntas": ["Pregunta 1", "Pregunta 2", "Pregunta 3"]}
    
@app.route("/codigo", methods=["POST"])
def codigo():
    if request.method == "POST":
        item = request.json.get("codigoAnfitrion")
        if item:
            codigos[item]={}
            respuestas[item]=[]
        return jsonify(success=True)

@app.route("/codigo_respuesta", methods=["POST"])
def codigo_respuesta():
    if request.method == "POST":
        item = request.json.get("codigo")
        if item in codigos:
            print("Codigo correcto")
            return jsonify(success=True)
        else:
            print("Codigo inexistente")
            return jsonify(success=False)


@app.route("/recibir_respuestas", methods=["POST"])
def recibir_respuestas():
    if request.method == "POST":
        res = request.json.get("respuestasFinal")
        item = res.get("resp")
        codigo = res.get("codigo")
        if item and codigo:
            print(item)
            respuestas[codigo].append(item)
            return jsonify(success=True)
        else:
            print("ERRRRORRRRRAKSHAHJSAGJGSAJASGJKH")
            return jsonify(success=False)

# Función para agregar una pregunta y sus respuestas a un código específico
def agregar_pregunta_respuesta(codigo, pregunta, respuestas):
    # Verifica si el código ya existe en el diccionario
    if codigo not in codigos:
        # Si no existe, inicializa el diccionario para ese código
        codigos[codigo] = {"preguntas": []}
    
    # Agrega un diccionario con la pregunta y sus respuestas
    codigos[codigo]["preguntas"].append({
        "pregunta": pregunta,
        "respuestas": respuestas,
    })

@app.route("/ingresar_respuesta", methods=["POST"])
def ingresar_respuesta():
    if request.method == "POST":
        item = request.json.get("preguntas_respuestas")
        code = item.get("codigo")
        codigos[code] = {"preguntas": []}
        preguntas = item.get("preguntas")  # Accede a la lista de preguntas
        print("INICIOOOO")
        print("PRIMERA PREGUNTA: ")
        for i in preguntas:
            agregar_pregunta_respuesta(code,i.get("pregunta"),i.get("respuestas"))
        print(codigos[code]["preguntas"][0]["pregunta"])
        print(codigos[code]["preguntas"][0]["respuestas"])
        print("SEGUNDA PREGUNTA: ")
        print(codigos[code]["preguntas"][1]["pregunta"])
        print(codigos[code]["preguntas"][1]["respuestas"])
        return jsonify(success=True)        

@app.route("/preguntas", methods=["POST"])
def preguntas():
    if request.method == "POST":
        item = request.json.get("codigo")
        if item in codigos:
            print("preguntas correctas")
            time.sleep(1)
            return jsonify(codigos[item])
            #return jsonify(code1["preguntas"])
        else:
            print("preguntas malas")
            return jsonify(success=False)
        
@app.route("/terminar", methods=["POST"])
def terminar():
    if request.method == "POST":
        codigo = request.json.get("codigoAnfitrion")
        correctas_sumadas[codigo]=[]
        print("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
        print(codigo)
        print(correctas)
        print("ZZZZZZ", correctas[codigo])
        print("ZZZZZZ",len(correctas[codigo]))
        for a in range (len(correctas[codigo])):
            print("KIEEEE")
            correctas_sumadas[codigo].append(0)
        print("CORRECTAS SUMADAS: ",correctas_sumadas)
        print("CORRECTAS SUMADAS: ",respuestas[codigo])
        for i in respuestas[codigo]:
            print("AQUI ESTA EL I",i)
            print("AQUI ESTA EL I",len(i))
            print("AQUI ESTA EL I",i[0])
            for num in range (len(i)):
                if i[num] == correctas[codigo][num]:
                    print("sumado correcto BIP BOP")
                    correctas_sumadas[codigo][num]=correctas_sumadas[codigo][num]+1
                """ if res == correctas[codigo][num]:
                    correctas_sumadas[codigo][indice]=correctas_sumadas[codigo][indice]+1 """
        print("TUTOOOOO:  ",correctas_sumadas[codigo])
        #respuestas[codigo]=[]
        #respuestas[codigo].append(item)
        return jsonify(correctas_sumadas[codigo])
        
@app.route("/recibir_respuestas_correctas", methods=["POST"])
def recibir_respuestas_correctas():
    if request.method == "POST":
        item = request.json.get("resCorrectas")
        codigo = item.get("codigo")
        resp = item.get("resp")
        print("RESSSPPPP",resp)
        correctas[codigo]=[]
        correctas[codigo]=resp
        print("respuestas correctas bien recibidas")
        print(correctas)
        return jsonify(success=True)
    else:
        print("ERROR en recibir res correctas")
        return jsonify(success=False)



if __name__ == "__main__":
    app.run(debug=True, port=4001)
