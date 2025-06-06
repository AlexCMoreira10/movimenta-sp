import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
//esta é a forma de usar import handlebars
//import Post from './models/Post.js'
import axios from 'axios';  //BASE PARA A COMUNICAÇÃO COM API HTTP, GET, POST,


//IMPORT DO BANCO DE DADOS
import Onibus from './models/Onibus.js'
import Cadastro from './models/Cadastro.js';
import OnibusRotasAssociadas from './models/OnibusRotasAssociadas.js';
import Rota from './models/Rota.js'
import Relatar from  './models/Relatar.js'

const app = express();
const __dirname = path.resolve();
const PORTA = process.env.PORT || 4200;
const TOKEN = 'fb6b4c7435eb736fb45aba0c2de04f28bd2ff795c5be10b14ac0b29054584771';
const BASE_URL = 'http://api.olhovivo.sptrans.com.br/v2.1';

//CONFIGURAÇÕES
    // Configuração do Template Engine
    app.engine('handlebars', engine({ defaultLayout: 'main',
      helpers: {
          json: function(context) {
            return JSON.stringify(context);
          }
        }
     }));
    app.set('view engine', 'handlebars');
    
//rota principal de acesso pra a api
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

// Usa cookies de sessão para manter a autenticação ativa
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import { setDefaultAutoSelectFamilyAttemptTimeout } from 'net';



const cookieJar = new CookieJar();

wrapper(axiosInstance);
axiosInstance.defaults.jar = cookieJar;

app.use(bodyParser.json());
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


app.post('/pesquisar_linha', async function (req, res) {
  const linha = req.body.linha;
  //console.log("Linha recebida:", linha);
  try {
    const response = await axiosInstance.get(`/Linha/Buscar?termosBusca=${linha}`);
    const dados = response.data;
    res.render('PaginaInicial', {dados});
   //res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
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
    //res.render('/PaginaInicial') //AQUI NO FUTURO TEM QUE SE TORNAR UM ROTA REDIRECT POST PARA PAGINA INICIAL, COM UM RETUNR ASSIM O APP FICA ROBUSTO E QUEBRA MENOS
    res.redirect('/PaginaInicial')
  } catch (error) {
    console.log(error)
    res.status(500).send("Erro de servidor!", error)
  }
})

//REDIRECT
app.get('/PaginaInicial', function(req, res){
  res.render('PaginaInicial')//, {raw: true, dados: response.data})
  //res.send(`<h1> SEM ERROR </H1>`)
  //console.log('ENTRANDO AQUIII!!');
  //res.render('PaginaInicial')
});

//aqui 
app.get('/Rota', function(req, res) {
    res.render('PaginaRota')
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
//Teste Demonstrativo E vamos melhorar no futuro;
app.get('/Capelinha', function(req, res) {
    Onibus.findAll({
        raw: true, //Pesquisa e me fala mais tarde
        attributes: ['codigo_linha', 'numero_linha'],
        order: [['idonibus', 'DESC']]
    }).then(function(onibus) {
        res.render('ListaDeOnibus', { onibus: onibus });
    }).catch(function(erro) {
        res.send("Erro ao carregar os ônibus: " + erro);
    });
});

app.get('/Relatar', function(req,res){
   res.render('Relatar');
});

app.get('/RotasDoBanco', async function (req,res){ 
 Rota.findAll({
    raw: true,
    attributes: ['nome_rota', 'descricao'],
    order: [['idrota', 'ASC']] // opcional, você pode mudar para DESC ou outro campo
  })
  .then(function(rotas) {
    res.render('RotasDoBanco', { rotas: rotas });
  })
  .catch(function(erro) {
    res.send("Erro ao carregar rotas: " + erro);
  });
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
app.get('/teste', function(req,res){
  res.render('Teste')
});

app.get('/hora_saida/:codigoLinha', async function(req, res) {
  const codigoLinha = req.params.codigoLinha;

  if (!codigoLinha) {
    return res.status(400).send("Parâmetro 'codigoLinha' é obrigatório.");
  }

  try {
    const response = await axiosInstance.get(`/Posicao/Linha?codigoLinha=${codigoLinha}`);
    const dados = response.data;
    res.render('HoraSaida', { dados });
  } catch (erro) {
    console.error('Erro ao consultar a API:', erro.message);
    res.status(500).send('<h1>Erro ao consultar API</h1><br>' + erro.message);
  }
});

app.get('/hora_saida2/:codigoLinha', async function(req, res) {
  const codigoLinha = req.params.codigoLinha;

  if (!codigoLinha) {
    return res.status(400).send("Parâmetro 'codigoLinha' é obrigatório.");
  }

  try {
    const response = await axiosInstance.get(`/Posicao/Linha?codigoLinha=${codigoLinha}`);
    const dados = response.data; // hr, vs[]
    res.render('PaginaRota', { dados });
  } catch (erro) {
    console.error('Erro ao consultar a API:', erro.message);
    res.status(500).send('<h1>Erro ao consultar API</h1><br>' + erro.message);
  }
});

app.post('/relatar_problema', async function(req, res){
   const { linha,tipo,descricao } = req.body;

  try {
    await Relatar.create({ linha,tipo, descricao });
      //res.json({ success: true, message: "Problema registrado com sucesso!" });
      res.redirect('PaginaInicial')
  }
  catch(error){
    console.log(error)
    res.status(500).send('Oh não! erro de servidor', error)
  }
});

app.listen(PORTA, async () => {
    await autenticar(); // Autentica assim que o servidor iniciar
    //console.log('Servidor rodando em http://localhost:'+PORTA);
});

//fazer um registro de numero ou nome handlebars, fazer um servidor index.js que esteja salvo no banco de dados 

