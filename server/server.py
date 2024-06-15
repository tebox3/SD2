from flask import Flask, request, jsonify
import time

app = Flask(__name__)
codigos = {}
code1 = {}
code1 = {"preguntas": ["assa","as","1111"]}
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
            codigos[item]=[]
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


@app.route("/ingresar_respuesta", methods=["POST"])
def ingresar_respuesta():
    if request.method == "POST":
        item = request.json.get("preguntas_respuestas")
        code = item.get("codigo")
        print("Codigo: ",code)
        preguntas = item.get("preguntas")  # Accede a la lista de preguntas
        print("Preguntas: ",preguntas)
        primera_pregunta = preguntas[0].get("pregunta")
        respuestas_primera_pregunta = preguntas[0].get("respuestas")  # Accede a las respuestas de la primera pregunta
        primera_respuesta = respuestas_primera_pregunta[0]  # Accede a la primera respuesta de la primera pregunta
        segunda_respuesta = respuestas_primera_pregunta[1]  # Accede a la segunda respuesta de la primera pregunta
        print("Primera pregunta: ",preguntas[0].get("pregunta"))
        print(primera_respuesta)
        print(segunda_respuesta)
        codigos[code]={}
        codigos[code][primera_pregunta]=[]
        codigos[code][primera_pregunta].append(primera_respuesta)
        codigos[code][primera_pregunta].append(segunda_respuesta)
        """ if item:
            codigos[item]={}
            codigos[item]["preguntas"]=[]
            codigos[item]["respuestas"]=[]
        codigos[item]["respuestas"].append("AASS")
        codigos[item]["respuestas"].append("ZZZZ")
        print(codigos[item]["respuestas"])
        print(codigos) """
        return jsonify(success=True)        

@app.route("/preguntas", methods=["POST"])
def preguntas():
    if request.method == "POST":
        item = request.json.get("codigo")
        if item in codigos:
            print("preguntas correctas")
            time.sleep(3)
            return jsonify(codigos[item])
            #return jsonify(code1["preguntas"])
        else:
            print("preguntas malas")
            return jsonify(success=False)

if __name__ == "__main__":
    app.run(debug=True, port=4001)
