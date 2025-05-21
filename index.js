import express from 'express';
import path from 'path';
//import bodyParser from 'body-parser';
//import Post from './models/Post.js'
//import axios from 'axios';  //BASE PARA A COMUNICAÇÃO COM API HTTP, GET, POST,


const app = express();
const __dirname = path.resolve();
const PORTA = process.env.PORT || 4200;
const TOKEN = 'fb6b4c7435eb736fb45aba0c2de04f28bd2ff795c5be10b14ac0b29054584771';
const BASE_URL = 'http://api.olhovivo.sptrans.com.br/v2.1';

const cookieJar = new CookieJar();

wrapper(axiosInstance);
axiosInstance.defaults.jar = cookieJar;

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function(req, res){
  res.send("<h1> TESTE DE SERVIDOR!! </h1> </br> <hr>")
})
app.get('/Sobre', function(res,req){
  res.sendFile(__dirname+'/view/sobre.html')
})
app.listen(PORTA, async () => {
    //await autenticar(); // Autentica assim que o servidor iniciar
    //console.log('Servidor rodando em http://localhost:'+PORTA);
});

