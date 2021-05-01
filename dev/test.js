const Blockchain = require('../blockchain');
const gooncoin = new Blockchain();

const bc1 = {
  "chain": [
  {
  "index": 1,
  "timestamp": 1619836715830,
  "transactions": [],
  "nonce": 100,
  "hash": "0",
  "previousBlockHash": "0"
  },
  {
  "index": 2,
  "timestamp": 1619836776807,
  "transactions": [],
  "nonce": 18140,
  "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
  "previousBlockHash": "0"
  },
  {
  "index": 3,
  "timestamp": 1619836842483,
  "transactions": [
  {
  "amount": 5,
  "sender": "00",
  "recipient": "d71ff74ab4fc4178b54e12e2afd76263",
  "transId": "cebdc793e3404d16b41f5777e5ab32dc"
  },
  {
  "amount": 10,
  "sender": "1ADSFA89798ADSFA897DFA8DF",
  "recipient": "1QEWRQWER123123QRQWER67456",
  "transId": "25754d18f625401cbbc7d2cba7ff1839"
  },
  {
  "amount": 100,
  "sender": "1ADSFA89798ADSFA897DFA8DF",
  "recipient": "1QEWRQWER123123QRQWER67456",
  "transId": "acd88fba28c3446aba19adf470c37132"
  },
  {
  "amount": 150,
  "sender": "1ADSFA89798ADSFA897DFA8DF",
  "recipient": "1QEWRQWER123123QRQWER67456",
  "transId": "6b8a8424ab654c29b2ea3ddaee8d9795"
  }
  ],
  "nonce": 53473,
  "hash": "000043dcf3e6bf3ce0fe26583e6ef7efe82240bb9be8ef93ebfa53d494ed82da",
  "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
  },
  {
  "index": 4,
  "timestamp": 1619836892391,
  "transactions": [
  {
  "amount": 5,
  "sender": "00",
  "recipient": "d71ff74ab4fc4178b54e12e2afd76263",
  "transId": "402903a7cfec48c88e3b6e1bf94c9250"
  },
  {
  "amount": 20,
  "sender": "1ADSFA89798ADSFA897DFA8DF",
  "recipient": "1QEWRQWER123123QRQWER67456",
  "transId": "71d9a08d29044ae1816f2e7947d3153f"
  },
  {
  "amount": 75,
  "sender": "1ADSFA89798ADSFA897DFA8DF",
  "recipient": "1QEWRQWER123123QRQWER67456",
  "transId": "12c1074147bc4b4b981bf9d60bcfc9a9"
  },
  {
  "amount": 200,
  "sender": "1ADSFA89798ADSFA897DFA8DF",
  "recipient": "1QEWRQWER123123QRQWER67456",
  "transId": "f395d3905afe436b89c746be10c918f8"
  },
  {
  "amount": 30,
  "sender": "1ADSFA89798ADSFA897DFA8DF",
  "recipient": "1QEWRQWER123123QRQWER67456",
  "transId": "fa69c8c3488b471ea0611c2da8b7c8fb"
  }
  ],
  "nonce": 44108,
  "hash": "00006222241d7bc560996f6895446a468ce7202b83ecd1e2db843f614f28d3d0",
  "previousBlockHash": "000043dcf3e6bf3ce0fe26583e6ef7efe82240bb9be8ef93ebfa53d494ed82da"
  },
  {
  "index": 5,
  "timestamp": 1619836902015,
  "transactions": [
  {
  "amount": 5,
  "sender": "00",
  "recipient": "d71ff74ab4fc4178b54e12e2afd76263",
  "transId": "a73cf8a358bf4aa185df99385502b32b"
  }
  ],
  "nonce": 34044,
  "hash": "0000bc08928d98e94619ee32033e3655a7b8a1bb0672f110f343b359028320bc",
  "previousBlockHash": "00006222241d7bc560996f6895446a468ce7202b83ecd1e2db843f614f28d3d0"
  },
  {
  "index": 6,
  "timestamp": 1619836905973,
  "transactions": [
  {
  "amount": 5,
  "sender": "00",
  "recipient": "d71ff74ab4fc4178b54e12e2afd76263",
  "transId": "5510bcf2b5b7435e875460318249aeb9"
  }
  ],
  "nonce": 114328,
  "hash": "0000569926f49380234aa0f3097ac18c99928a7ccb75fd899092e9e2a1313078",
  "previousBlockHash": "0000bc08928d98e94619ee32033e3655a7b8a1bb0672f110f343b359028320bc"
  }
  ],
  "pendingTransactions": [
  {
  "amount": 5,
  "sender": "00",
  "recipient": "d71ff74ab4fc4178b54e12e2afd76263",
  "transId": "6d7e578e672a444089b82dcbf223493e"
  }
  ],
  "currentNodeUrl": "http://localhost:3001",
  "networkNodes": []
  };

  console.log('Valid: ', gooncoin.chainIsValid(bc1.chain));

