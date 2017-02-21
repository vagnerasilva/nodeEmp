var express = require('express');
var app = express();


app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

cont = 0;


app.get('/chamada', function(req, res) { // 

    cont++;
 console.log("Pedido de Ordem chegando n: "+cont );
   // console.log(req.data);
    gatilho();
    res.status(200).json({
        exec: "chamado ok executando item da fila de ordens"
    });
  // Enviando Historico de chamadas Dashboard
});// Fim do GET /api/dashboard



// Chamada constanto do SAP para verificar fila de eventos a realizar

function gatilho(){
    setTimeout(function(){
  
    console.log("devolvendo resposta pro nodejs");
    var http = require("http");

    var options = {
    "method": "GET",
    "hostname": "localhost",
    "port": "3000",
    "path": "/resEmpilha",
    "headers": {
        "cache-control": "no-cache",
        "postman-token": "10640850-b7d1-8207-6d5b-17126776c88c"
    }
    };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });
    });

    req.end();
    console.log("Ja Terminei a ordem devolvendo STATUS");

  },10000);
}




