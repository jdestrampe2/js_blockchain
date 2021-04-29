const express = require('express');
const Blockchain = require('./blockchain');
const { v4: uuidv4 } = require('uuid');
const app = express();

const nodeAddress = uuidv4().split('-').join('');

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
  const lastBlock = gooncoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];

  const currentBlockData = {
    transactions: gooncoin.pendingTransactions,
    index: lastBlock['index'] + 1,
  }

  const nonce = gooncoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = gooncoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  gooncoin.createNewTransaction(1.0, "00", nodeAddress);

  const newBlock = gooncoin.createNewBlock(nonce, previousBlockHash, blockHash);
  res.json({
    note: "New block mined successfully!",
    block: newBlock,
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});