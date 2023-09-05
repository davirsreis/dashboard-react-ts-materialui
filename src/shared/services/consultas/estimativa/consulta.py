import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller
import requests
import pandas as pd

def fetch_faturamentos(data_inicial, data_final):
    url = f"http://localhost:3001/api/faturamentos/total?start_date={data_inicial}&end_date={data_final}"
    response = requests.get(url)
    return response.json()

def fetch_crescimento(data_inicial, data_final):
    url = f"http://localhost:3001/api/crescimento/total?start_date={data_inicial}&end_date={data_final}"
    response = requests.get(url)
    return response.json()

def getEstimativaFaturamento(data_inicial, data_final):

    data_inicial = "2020-01-01"
    data_final = "2022-09-30"
    data = fetch_faturamentos(data_inicial, data_final)
    data1 = fetch_faturamentos("2022-10-01", "2022-12-31")

    df1 = pd.DataFrame.from_dict({(i,j): data[i][j]['total'] for i in data.keys() for j in data[i].keys()}, orient='index', columns=['total'])
    df1.index = pd.to_datetime(df1.index.map(lambda x: '-'.join(map(str, x))), format='%Y-%m')
    df1 = df1.asfreq('MS')

    df3 = pd.DataFrame.from_dict({(i,j): data1[i][j]['total'] for i in data1.keys() for j in data1[i].keys()}, orient='index', columns=['total'])
    df3.index = pd.to_datetime(df3.index.map(lambda x: '-'.join(map(str, x))), format='%Y-%m')
    df3 = df3.asfreq('MS')

    result = adfuller(df1['total'])

    df_diff = df1['total'].diff().dropna()

    result_diff = adfuller(df_diff)

    p = 3
    d = 1
    q = 2
    n = 3

    model = ARIMA(df1['total'], order=(p, d, q))
    model_fit = model.fit()

    forecast = model_fit.predict(start=len(df1), end=len(df1) + n-1)

    idx = pd.date_range(start=df1.index[-1] + pd.DateOffset(months=1), periods=n, freq='MS')

    # Plotar a série temporal das previsões
    # plt.figure(figsize=(12, 6))
    # plt.plot(df1.index, df1['total'], label='Observado')
    # plt.plot(idx, forecast, label='Previsão')
    # plt.xlabel('Data')
    # plt.ylabel('Total')
    # plt.title('Previsão de Faturamentos')
    # plt.legend()
    # plt.show()

    df2=forecast
    # print(df2)

    df2 = df2.to_frame()

    df1 = df1.rename(columns={'total': 'Faturamento'})
    df2 = df2.rename(columns={'total': 'Faturamento'})
    df3 = df3.rename(columns={'total': 'Faturamento'})

    df1 = df1.rename_axis('data')
    df2 = df2.rename_axis('data')   
    df3 = df3.rename_axis('data')

    print(df3,df2)
    return df1,df2,df3

data_inicial = "2020-01-01"
data_final = "2022-09-30"
getEstimativaFaturamento(data_inicial, data_final)

# def getEstimativaCrescimento(data_inicial, data_final):

#     data_inicial = "2020-01-01"
#     data_final = "2022-09-30"
#     data = fetch_crescimento(data_inicial, data_final)

#     df1 = pd.DataFrame.from_dict({(i,j): data[i][j]['crescimento'] for i in data.keys() for j in data[i].keys()}, orient='index', columns=['crescimento'])
#     df1.index = pd.to_datetime(df1.index.map(lambda x: '-'.join(map(str, x))), format='%Y-%m')
#     df1 = df1.asfreq('MS')

#     print(df1)

#     # result = adfuller(df1['crescimento'])

#     # df_diff = df1['crescimento'].diff().dropna()

#     # result_diff = adfuller(df_diff)

#     # p = 3
#     # d = 1
#     # q = 2
#     # n = 3

#     # model = ARIMA(df1['crescimento'], order=(p, d, q))
#     # model_fit = model.fit()

#     # forecast = model_fit.predict(start=len(df1), end=len(df1) + n-1)

#     # idx = pd.date_range(start=df1.index[-1] + pd.DateOffset(months=1), periods=n, freq='MS')

#     # df2=forecast
#     # print(df2)

#     # df2 = df2.to_frame()

#     # df1 = df1.rename(columns={'crescimento': 'Faturamento'})
#     # df2 = df2.rename(columns={'crescimento': 'Faturamento'})

#     # df1 = df1.rename_axis('data')
#     # df2 = df2.rename_axis('data')   

#         # Plotar a série temporal das previsões
#     # plt.figure(figsize=(12, 6))
#     # plt.plot(df1.index, df1['crescimento'], label='Observado')
#     # plt.plot(idx, forecast, label='Previsão')
#     # plt.xlabel('Data')
#     # plt.ylabel('crescimento')
#     # plt.title('Previsão do crescimento')
#     # plt.legend()
#     # plt.show()

#     # print(df1)
#     # return df1,df2

# getEstimativaCrescimento('2020-01-01', '2022-12-31')



