const express = require('express');
const Blockchain = require('./blockchain');
const app = express();

const gooncoin = new Blockchain();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/blockchain', (req, res) => {
  res.send(gooncoin);
});

app.post('/transaction', (req, res) => {
  console.log(req.body);
  res.send(`The amount of the transaction is ${req.body.amount} gooncoin.`);
});

app.get('/mine', (req, res) => {

});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});