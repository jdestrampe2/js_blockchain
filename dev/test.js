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

console.log(gooncoin.hashBlock(previousBlockHash, currentBlockData, 7681));