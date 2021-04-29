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
  const blockIndex = gooncoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({ note: `Transaction will be added in block ${blockIndex}.`});
});

app.get('/mine', (req, res) => {

});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});