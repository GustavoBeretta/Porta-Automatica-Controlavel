const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


let porta = 8090;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});

const sqlite3 = require('sqlite3');

var db = new sqlite3.Database('./logging.db', (err) => {
        if (err) {
            console.log('ERRO: não foi possível conectar ao SQLite.');
            throw err;
        }
        console.log('Conectado ao SQLite!');
    });

db.run(`CREATE TABLE IF NOT EXISTS logging
        (datahora TEXT DEFAULT CURRENT_TIMESTAMP PRIMARY KEY, distancia TEXT NOT NULL)`, 
        [], (err) => {
           if (err) {
              console.log('ERRO: não foi possível criar tabela.');
              throw err;
           }
      });    

app.post('/logging', (req, res, next) => {
    db.run(`INSERT INTO logging(distancia) VALUES(?)`, 
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


app.get('/logging', (req, res, next) => {
    db.all(`SELECT * FROM logging`, [], (err, result) => {
        if (err) {
             console.log("Erro: " + err);
             res.status(500).send('Erro ao obter dados.');
        } else {
            res.status(200).json(result);
        }
    });
});