# Monitor API

Este projeto tem como objetivo executar o comando coleta de informações de um computador no terminal através de endpoints disponíveis via Web.

## Instalação

Para executar o projeto é necessário que seu computador possua o node.js mais recente instalado. Logo em seguida, deve-se copiar o projeto através do comando:

```
$ git clone https://github.com/lucachaves/monitor-api.git
```

O projeto possui alguma dependências que precisam ser instaladas. Para isto, acesse a cópia e execute a instalação dos pacotes via o npm:

```
$ cd ping-api
$ npm install
```

Em seguida, para disponibilizar a API localmente basta executar o servidor:

```
$ npm start
```

## Descrição

A coleta de informações precisa declara especificamente que dados deseja ser acesso através de rotas. A seguir, será detalhado os endpoints disponibilizados pelo projeto.

### Listando rotas disponívies

Para auxiliar no processo de consumo desta API foi idealizado que a rota `/v1` listaria todas as rotas disponíveis na API.

Por exemplo, para obter coletar todas as rotas disponíveis basta utilizar esta URL:

> http://localhost:5000/v1/

resultando na seguinte resposta:

```javascript
[
  "http://localhost:5000/v1/cpuname",
  "http://localhost:5000/v1/cpustatus",
  "http://localhost:5000/v1/memory",
  "http://localhost:5000/v1/overview"
]
```

Observe que este resultado retorna todos os endpoint.

### Informações Gerais

### Nome da CPU

### Status da CPU

### Status da Memory
