const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/blockchain', (req, res) => {

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