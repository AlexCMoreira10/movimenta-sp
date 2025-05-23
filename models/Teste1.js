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

INSERT INTO onibus (codigo_linha, numero_linha, idonibus)
VALUES
('031F', '6816-10', 1),
('014D', '6826-10', 2),
('041B', '6820-31', 3),
('028K', '6824-10', 4),
('039K', '6823-10', 5),
('204K', '6805-10', 6),
('051C', '6821-10', 7),
('016M', '6815-10', 8),
('086N', '6036-10', 9),
('032R', '6817-10', 10),
('062R', '6816-31', 11),
('082R', '6037-10', 12),
('011E', '6818-10', 13),
('010G', '6820-10', 14),
('188-0', '6042-22', 15),
('068Q', '6837-10', 16),
('057O', '6042-21', 17),
('050T', '6039-21', 18),
('038-1', 'N735-11', 19),
('070L', 'N739-11', 20),
('019S', '648P-10', 21),
('020S', '5119-10', 22),
('017V', '695V-10', 23),
('085U', '695T-51', 24),
('088U', '695T-1', 25),
('089U', '695T-10', 26),
('013P', 'N843-11', 27),
('061W', '6450-10', 28),
('066W', '6455-10', 29),
('108I', 'N745-11', 30),
('042J', '6813-10', 31),
('045J', '6805-31', 32),
('047Z', '677Y-10', 33),
('035X', 'N731-11', 34),
('036X', 'N704-11', 35),
('037X', '6007-10', 36),
('038X', '6001-10', 37),
('072H', '6835-10', 38),
('076H', '6835-31', 39),
('078H', '6825-10', 40),
('012Y', '6840-10', 41),
('023A', '6045-21', 42),
('021A', 'N734-11', 43),
('022A', 'N741-11', 44);
