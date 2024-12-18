const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


let porta = 8080;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});

const sqlite3 = require('sqlite3');

var db = new sqlite3.Database('./controle.db', (err) => {
        if (err) {
            console.log('ERRO: não foi possível conectar ao SQLite.');
            throw err;
        }
        console.log('Conectado ao SQLite!');
    });

db.run(`CREATE TABLE IF NOT EXISTS controle
        (id INTEGER PRIMARY KEY, distancia TEXT NOT NULL, datahora TEXT DEFAULT CURRENT_TIMESTAMP)`, 
        [], (err) => {
           if (err) {
              console.log('ERRO: não foi possível criar tabela.');
              throw err;
           }
      });    

app.post('/controle', (req, res, next) => {
    db.run(`INSERT INTO controle(distancia) VALUES(?)`, 
         [req.body.distancia], (err) => {
        if (err) {
            console.log("Error: " + err);
            res.status(500).send('Erro ao fazer o registro.');
        } else {
            console.log('Registro feito com sucesso!');
            res.status(200).send('Registro feito com sucesso!');
        }
    });
});


app.get('/controle', (req, res, next) => {
    db.all(`SELECT * FROM controle`, [], (err, result) => {
        if (err) {
             console.log("Erro: " + err);
             res.status(500).send('Erro ao obter dados.');
        } else {
            res.status(200).json(result);
        }
    });
});