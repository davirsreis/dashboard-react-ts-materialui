from flask import Flask, request, jsonify
from consulta import getEstimativaFaturamento
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/estimativa-faturamento', methods=['GET'])
def estimativa_faturamento():
    data_inicial = request.args.get('data_inicial')
    data_final = request.args.get('data_final')

    df1, df2, df3 = getEstimativaFaturamento(data_inicial, data_final)

    df1.index = df1.index.map(lambda x: x.strftime('%Y-%m-%d'))
    df2.index = df2.index.map(lambda x: x.strftime('%Y-%m-%d'))
    df3.index = df3.index.map(lambda x: x.strftime('%Y-%m-%d'))

    # Convertemos os DataFrames para JSON e retornamos como resposta
    response = {
        'df1': df1.to_json(orient='split'),
        'df2': df2.to_json(orient='split'),
        'df3': df3.to_json(orient='split')
    }

    # print("teste",response)

    return jsonify(response)

if __name__ == '__main__':
    app.run()
