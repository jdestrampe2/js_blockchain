const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const { v4: uuidv4 } = require('uuid');

const Blockchain = () => {
	this.chain = [];
	this.pendingTransactions = [];
	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];
  this.createNewBlock(100, '0', '0');
};

Blockchain.prototype.createNewBlock = (nonce, previousBlockHash, hash) => {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash,
	};

	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
};

Blockchain.prototype.getLastBlock = () => {
	return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = (amount, sender, recipient) => {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transId: uuidv4().split('-').join(''),
	};
	return newTransaction;
};

Blockchain.prototype.addToPendingTrans = (transObject) => {
	this.pendingTransactions.push(transObject);
	return this.getLastBlock()['index'] +1;
};

Blockchain.prototype.hashBlock = (previousBlockHash, currentBlockData, nonce) => {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};

Blockchain.prototype.proofOfWork = (previousBlockHash, currentBlockData) => {
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

	while (hash.substring(0, 4) !== '0000') {
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}
	return nonce;
};

Blockchain.prototype.chainIsValid = (blockchain) => {
	let validChain = true;

	for (let i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const previousBlock = blockchain[i -1];
		const blockHash = this.hashBlock(previousBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);

		if (blockHash.substring(0, 4) !== '0000') 
			validChain = false;

		if (currentBlock['previousBlockHash'] !== previousBlock['hash'])
			validChain = false;
	};
	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] ==='0';
	const correctTransactions = genesisBlock['transaction'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions)
		validChain = false;

	return validChain;
};

module.exports = Blockchain;
