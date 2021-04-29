const Blockchain = require('./blockchain');
const gooncoin = new Blockchain();

const previousBlockHash = '1234wasd';
const currentBlockData = [
  {
    amount: 100,
    sender: 'asdfasdewqwetr',
    recipient: 'oiutrkjasnfdks'
  },
  {
    amount: 150,
    sender: '1asdfasdewqwetr',
    recipient: '1oiutrkjasnfdks'
  },
  {
    amount: 10,
    sender: '2asdfasdewqwetr',
    recipient: '2oiutrkjasnfdks'
  },
];

const nonce = 100;

console.log(gooncoin.hashBlock(previousBlockHash, currentBlockData, nonce));