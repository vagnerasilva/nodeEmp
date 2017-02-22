var express = require('express');
var app = express();
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var cont = 0;
var status={};
status.ok= true;

var fila =[];
var valor ={}
var msg ={}
//###################### VERIFICANDO SAP ##########################################################/////

// Chamada constanto do SAP para verificar fila de eventos a realizar
var myVar = setInterval(function(){ myTimer() }, 1000); // A acada 10 segundos verifica no SAP se tem pedidos em fila

function myTimer() {
  cont++
      console.log("Buscas no SAP : "+cont + "  Status EMP: " +status.ok );
      var request = require("request");
      var options = { method: 'GET',
        url: 'https://iotmmsp1942419907trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http/data/5c6a6674-b193-4c69-bc62-f32a3fdd39c7',
        headers: 
        { 'postman-token': 'a0b230ba-10ba-354c-39c6-1e0a692700a8',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: 'Bearer f3c1d3e8ecbb4a7da81b5a6f695458d' } };
      request(options, function (error, response, body) {  // Ignorando Erro se por acaso nao completar o GET
        //if (error) throw new Error(error);
        //console.log(error);
        //console.log(body);
       if (!error && response.statusCode == 200) {
         var parsed = JSON.parse(body);
              for(var x in parsed){ // Buscando itens no objeto e colocando no array
                  fila.push(parsed[x]);
              }
          }
      }); 
      ///#### Construindo FILA com os pedidos vindos do SAP ######///
// Quando existir uma Fila e a EMPILHADEIRA ja tiver terminado a TAREFA DELA 
if(fila.length>0 && status.ok==true ){
   console.log(" Tamanho da Fila tem : " + fila.length );
    chamarEmpi(fila[0]); //
    chamarEmpFake(fila[0]); 
 }
} // Fim da funcao de repeticao 
//###################### VERIFICANDO SAP ##########################################################/////

//###################### Enviando PEDIDO EMPILHADEIRA ##########################################################/////
function chamarEmpi(pedido){
    status.ok= false;
  //  console.log(" A Empilhadeira vai receber a ORDEM :"+ pedido.messages[0].TransfOrder)
  //  console.log("PosFrom" + pedido.messages[0].PosFrom)
  //  console.log("PosTo" + pedido.messages[0].PosTo)
  

    var request = require("request");
    var options = { method: 'GET',
      url: 'http://192.168.0.80/'+ pedido.messages[0].PosFrom +','+ pedido.messages[0].PosTo
    };
    console.log(options.url); // Comando para a Empilhadeira
    request(options, function (error, response, body) {
    });
}
//###################### Enviando PEDIDO EMPILHADEIRA ##########################################################/////

//###################### Enviando PEDIDO EMPfake ##########################################################/////
function chamarEmpFake(pedido){
    status.ok= false;
   // console.log(" A Empilhadeira vai receber a ORDEM :"+ pedido.messages[0].TransfOrder)
   // console.log("PosFrom" + pedido.messages[0].PosFrom)
   // console.log("PosTo" + pedido.messages[0].PosTo)
  
    var http = require("http");
    var ordemEmp = {
      "method": "GET",
      "hostname": "localhost",
      "port": "5000",
      "path": "/chamada?=" ,
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
     // console.log(body.toString());
    });
});

req.end();
console.log("Pedido fake feito");
}
//###################### Enviando PEDIDO EMPILHADEIRA ##########################################################/////








//###################### Enviando POST SAP ordem EXECUTADA ################################################///
function respostaSAP(infopedido){
var request = require("request");

var options = { method: 'POST',
  url: 'https://iotmmsp1942419907trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http/data/5c6a6674-b193-4c69-bc62-f32a3fdd39c7',
  headers: 
   { 'postman-token': '726a5c28-0f15-2f43-7189-2d2ed276ae91',
     'cache-control': 'no-cache',
     'content-type': 'application/json',
     authorization: 'Bearer f3c1d3e8ecbb4a7da81b5a6f695458d' },
  body: 
   { mode: 'sync',
     messageType: '6132ab2a5a463b8356a7',
     messages: [ { TransfOrder: '1234567890', //infopedido.messages[0].TransfOrder ,
                   Confirm: 'true' } 
               ] },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

 // console.log(body);
});
console.log(" ORDEM EXECUTADA POST ENVIADO AO SAP :"); //+ infopedido.messages[0].TransfOrder );

}

//###################### Enviando POST SAP ordem EXECUTADA ################################################///

val1 = 2;
val2 = 4;

//##### ENVIO DE PEDIDO PARA EMPILHADEIRA#####/////

/// Criar chamada automatica da empilhadeira
app.get('/teste', function (req, res) {
  console.log("chamando empilhadeira");
  res.send('Empilhadeira recebeu ordem');
 // chamarEmpi();
    chamarEmpFake()
});


app.get('/ordem', function (req, res) {
  console.log("chamando empilhadeira");
  chamarEmpFake()
  res.send('Empilhadeira recebeu ordem');

  var request = require("request");

  var options = { method: 'GET',
    url: 'http://192.168.0.80/'+ val1 +','+ val2
  };
  console.log(options.url); // Comando para a Empilhadeira
  request(options, function (error, response, body) {
});

});












app.get('/resEmpilha', function (req, res) {

  console.log("Confirmacao Ordem Executada AGORA LIVRE PRO PROXIMO")
  status.ok= true;
  respostaSAP(fila[0])
  fila.shift();
  res.send('respondido!');
 
});