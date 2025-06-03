import express from 'express';
import { engine } from 'express-handlebars';
import teste_db from './models/teste_db.js';
import Teste from './models/teste.js';
import teste_db from './teste_db.js';

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const testes = await Teste.findAll();
    res.render('lista', { testes });
  } catch (err) {
    res.status(500).send('Erro ao buscar dados');
  }
});

teste_db.sequelize.sync().then(() => {
  app.listen(8081, () => {
    console.log('Servidor rodando em http://localhost:8081');
  });
});
///rever esse arquivo