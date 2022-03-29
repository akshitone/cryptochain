const Blockchain = require("./blockchain");
const cryptoHash = require("./cryptoHash");

const blockchain = new Blockchain();

blockchain.addBlock({ data: "foo" });
blockchain.addBlock({ data: "bar" });
blockchain.addBlock({ data: "baz" });

// console.log(blockchain.chain);

// console.log(blockchain.chain[3].hash);

const { timestamp, previousHash, hash, data } = blockchain.chain[2];

// console.log(timestamp, previousHash, hash, data);

// console.log(cryptoHash({ timestamp, previousHash, data }));

Blockchain.isValidChain(blockchain.chain);
