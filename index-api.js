import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
//esta é a forma de usar import handlebars
//import Post from './models/Post.js'
import axios from 'axios';  //BASE PARA A COMUNICAÇÃO COM API HTTP, GET, POST,
import Cadastro from './models/cadastro.js';

const app = express();
const __dirname = path.resolve();
const PORTA = process.env.PORT || 4200;
const TOKEN = 'fb6b4c7435eb736fb45aba0c2de04f28bd2ff795c5be10b14ac0b29054584771';
const BASE_URL = 'http://api.olhovivo.sptrans.com.br/v2.1';

//CONFIGURAÇÕES
    // Configuração do Template Engine
    app.engine('handlebars', engine({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');
    
//rota principal de acesso pra a api
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

// Usa cookies de sessão para manter a autenticação ativa
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

const cookieJar = new CookieJar();

wrapper(axiosInstance);
axiosInstance.defaults.jar = cookieJar;

app.use(bodyParser.urlencoded({ extended: true }));

//aqui precisamos iniciar a autenticação antes de iniciar o servidor
async function autenticar() {
    try {
      const response = await axiosInstance.post(`/Login/Autenticar?token=${TOKEN}`);
      if (response.data === true) {
        console.log('✅ Autenticado com sucesso na API Olho Vivo.');
      } else {
        console.log('❌ Falha na autenticação.');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error.message);
    //serve para manter o navedador funcionando
    }
  }

app.get('/', function(req, res ) {
    console.log('Resposta do servidor');
    //res.sendFile(__dirname + '/views/Home.html');
    res.render('Home')
})


app.post('/pesquisar_linha', async (req, res) => {
    const linha = req.body.linha;
    try {
      const response = await axiosInstance.get(`/Linha/Buscar?termosBusca=${linha}`);
      //res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
      res.render('Teste', {dados: response.data})
    } catch (error) {
      console.error('Erro ao buscar linha:', error.message);
      res.status(500).send('Erro ao buscar a linha de ônibus.');
    }
  });

app.post('/cadastrar', async function(req, res) {
  const tel = req.body.telefone;
  //console.log(tel)
  try {
    const usuario = await Cadastro.findOne({
      where:  {
        Telefone: tel
      }
    }) 
    if (!usuario) {
      console.log('Usuario não cadastrado, Registrando...')
      Cadastro.create({
        Telefone: tel
      })
    } else {
      console.log('Usuario já cadastrado, Logando...')
    }
    res.render('PaginaInicial')
  } catch (error) {
    res.status(500).send("Erro de servidor!")
  }




})

//aqui 
app.get('/Rota', function(req, res) {
    res.sendFile(__dirname+'/views/PaginaRota.html')
})

//VERIFICACAO POR POSICAO
app.get('/posicao_veiculos', async (req, res) => {
    try {
        const response = await axiosInstance.get('/Posicao');
        res.json(response.data); // ou use res.render() se quiser HTML
    } catch (error) {
        console.error('Erro ao buscar posição dos veículos:', error.message);
        res.status(500).json({ erro: 'Erro ao buscar dados de posição dos veículos.' });
    }
});

app.post('/buscar_termo', async (req,res) => {
    const buscar_termo = req.body.buscar_termo;
    try{
       const response = await axiosInstance.get(`/Parada/Buscar?termosBusca=${buscar_termo}`);
       //const response = await axiosInstance.get(`/Parada/Buscar?termosBusca=${buscar_termo}`);
       res.send (`<prev>${JSON.stringify(response.data,null, 2)}</prev>`);
       //console.log(typeof(response))
       //res.render('Teste', {dados: response.data} )
    }
    catch (error) {
        console.error('Vc errou sem burro!!:', error.message);
        res.status(500).send('Tu errou faça denovo');
    }
})
app.post('/buscar_termo_sentido', async (req, res) => {
    const linha = req.body.linha;
    const sentido = parseInt(req.body.sentido, 10); // Converte para número

    // Validação: sentido deve ser 1 ou 2
    if (![1, 2].includes(sentido)) {
        return res.status(400).send('O valor de "sentido" deve ser 1 ou 2.');
    }

    try {
        const response = await axiosInstance.get(`/Linha/BuscarLinhaSentido?termosBusca=${linha}&sentido=${sentido}`);
        res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
    } catch (error) {
        console.error('Erro ao buscar linha com sentido:', error.message);
        res.status(500).send('Erro ao buscar a linha com sentido.');
    }
});
//vamos cagar mais um pouco no app requisicao com latitude:
//posicao da linha 
app.get('/posicao_linha', async (req, res) => {
    const codigoLinha = req.query.linha;

    try {
        const response = await axiosInstance.get(`/Posicao/Linha?codigoLinha=${codigoLinha}`);//
        res.render('Teste', { dados: response.data });
    } catch (error) {
        console.error('Erro ao buscar posição da linha:', error.message);
        res.status(500).send('Erro ao buscar a posição da linha. Tente novamente.');
    }
});

app.listen(PORTA, async () => {
    await autenticar(); // Autentica assim que o servidor iniciar
    //console.log('Servidor rodando em http://localhost:'+PORTA);
});

