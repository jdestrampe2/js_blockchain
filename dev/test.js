const Blockchain = require('./blockchain');

const gooncoin = new Blockchain();

gooncoin.createNewBlock(12345, 'qwerty', 'wasdz');
gooncoin.createNewTransaction(100, 'JOHN54321', 'BOB54321');

gooncoin.createNewBlock(54321, 'qwerty1', 'wasdz1');

console.log(gooncoin);
