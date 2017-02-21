var express = require('express');
var app = express();
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});




var cont = 0;
var status={};
status.ok= true;
status.ordemEmp= "3,4";
var fila =[];
var valor ={}
var msg ={}
//###################### VERIFICANDO SAP ##########################################################/////

// Chamada constanto do SAP para verificar fila de eventos a realizar
var myVar = setInterval(function(){ myTimer() }, 400); // A acada 10 segundos verifica no SAP se tem pedidos em fila

function myTimer() {
  cont++
      console.log("Buscando pedidos no SAP : "+cont);
      var request = require("request");

      var options = { method: 'GET',
        url: 'https://iotmmsp1942341624trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http/data/63344e9a-43d9-48ee-97c6-583672cfe842',
        headers: 
        { 'postman-token': 'ae9a44cb-85d3-a841-4429-d94f2388e1c3',
          'cache-control': 'no-cache',
          'content-type': 'application/json;chartset=utf-8',
          authorization: 'Bearer e88562ce4f6e114ebed995e12129e82b' } };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);

        
              var parsed = JSON.parse(body);
              
              for(var x in parsed){ // Buscando itens no objeto e colocando no array
              fila.push(parsed[x]);
              }
          
      });



// Quando existir uma Fila e a EMPILHADEIRA ja tiver terminado a TAREFA DELA 
if(fila.length>0 && status.ok==true ){
   console.log(" A Fila tem" + fila.length +" Enviando Pedido mais velho");
    chamarEmpi(fila[0]); // 
    fila.shift();
  // console.log(fila.length);
 }


} // Fim da funcao de repeticao 
//###################### VERIFICANDO SAP ##########################################################/////

//###################### Enviando PEDIDO EMPILHADEIRA ##########################################################/////
function chamarEmpi(pedido){
    status.ok= false;
    console.log(" A Empilhadeira vai receber esta ORDEM ")
    console.log("PosFrom" + pedido.messages[0].PosFrom)
    console.log("PosTo" + pedido.messages[0].PosTo)

    var http = require("http");

    var ordemEmp = {
      "method": "GET",
      "hostname": "localhost",
      "port": "5000",
      "path": "/chamada?=" + pedido.messages[0].PosFrom + pedido.messages[0].PosTo,
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "214c8d25-9009-e80f-f09c-b22525e1db47"
      }
    };

    var req = http.request(ordemEmp, function (res) {
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
}

//###################### Enviando PEDIDO EMPILHADEIRA ##########################################################/////















//##### ENVIO DE PEDIDO PARA EMPILHADEIRA#####/////

/// Criar chamada automatica da empilhadeira
app.get('/teste', function (req, res) {
  res.send('Empilhadeira recebeu ordem');
 // chamarEmpi();

});


app.get('/resEmpilha', function (req, res) {

  console.log("estou livre denovo OK CHEGOU")
  status.ok= true;
  res.send('respondido!');
 
});