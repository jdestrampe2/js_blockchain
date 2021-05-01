const express = require('express');
const Blockchain = require('../blockchain');
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
  const newTransaction = req.body;
  const blockIndex = gooncoin.addToPendingTrans(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.post('/transaction/broadcast', (req, res) => {
  const newTransaction = gooncoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  gooncoin.addToPendingTrans(newTransaction);

  const requestPromises =[];
  gooncoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises)
  .then(data => {
    res.json({ note: 'Transaction created and broadcast successfully.'});
  });
});

app.get('/mine', (req, res) => {
  const lastBlock = gooncoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];

  const currentBlockData = {
    transactions: gooncoin.pendingTransactions,
    index: lastBlock['index'] + 1,
  };
  const nonce = gooncoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = gooncoin.hashBlock(previousBlockHash, currentBlockData, nonce);
  const newBlock = gooncoin.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];
  gooncoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: { newBlock: newBlock },
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises).then(data => {
    const requestOptions = {
      uri: gooncoin.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      body: {
        amount: 5.0,
        sender: "00",
        recipient: nodeAddress,
      },
      json: true
    };
    return rp(requestOptions);
  })
  .then(data => {
    res.json({
      note: "New block mined and broadcast successfully.",
      block: newBlock,
    });
  });
});

app.post('/receive-new-block', (req, res) => {
  const newBlock = req.body.newBlock;
  const lastBlock = gooncoin.getLastBlock();
  const correctHash = (lastBlock.hash === newBlock.previousBlockHash);
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

  if (correctHash && correctIndex) {
    gooncoin.chain.push(newBlock);
    gooncoin.pendingTransactions = [];
    res.json({
      note: 'New block received and accepted.',
      newBlock: newBlock,
    });
  } else {
      res.json({
        note: 'New block rejected.',
        newBlock: newBlock,
      });
  };
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

app.get('/consensus', (req, res) => {
  const requestPromises = [];
  gooncoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true,
    };
    requestPomises.push(rp(requestOptions));
  });
  Promise.all(requestPromises)
  .then(blockchains => {
    const currentChainLength = gooncoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(blockchain => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      };
    });
    if (!newLongestChain || (newLongestChain && !gooncoin.chainIsValid(newLongestChain))) {
      res.json({ 
        note: 'Current chain has correct.',
        chain: gooncoin.chain,
      });
    } else if (newLongestChain && gooncoin.chainIsValid(newLongestChain)) {
        gooncoin.chain = newLongestChain;
        gooncoin.pendingTransactions = newPendingTransactions;
        res.json({
          note: 'Chain has been update.',
          chain: gooncoin.chain,
        });
      };
  });
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});