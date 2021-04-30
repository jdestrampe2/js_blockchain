const express = require('express');
const Blockchain = require('./blockchain');
const { v4: uuidv4 } = require('uuid');
const rp = require('request-promise');
const PORT = process.argv[2];
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

  gooncoin.createNewTransaction(5.0, "00", nodeAddress);

  const newBlock = gooncoin.createNewBlock(nonce, previousBlockHash, blockHash);
  res.json({
    note: "New block mined successfully!",
    block: newBlock,
  });
});

//Register Node and Broadcast it to Network
app.post('/register-and-broadcast-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  if (gooncoin.networkNodes.indexOf(newNodeUrl) == -1) gooncoin.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];

  gooncoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };
    regNodesPromises.push(rp(requestOptions));
  });

  Promise.all(regNodesPromises)
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: { allNetworkNodes: [ ...gooncoin.networkNodes, gooncoin.currentNodeUrl ] },
        json: true,
      };
      return rp(bulkRegisterOptions);
    }).then(data => { 
        res.json({ note: 'New node registered with network successfully!' });
    });
});

//Register a Node with the Network
app.post('/register-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotRegistered = gooncoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = gooncoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotRegistered && notCurrentNode) gooncoin.networkNodes.push(newNodeUrl);
  res.json({ note: 'New node registered successfully.'});
});

//Register Multiple Nodes at Once
app.post('/register-nodes-bulk', (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotPresent = gooncoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = gooncoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotPresent && notCurrentNode) gooncoin.networkNodes.push(networkNodeUrl);
  });
    res.json({ note: 'Bulk Registration Successful.'});
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});