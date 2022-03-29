const { GENESIS_BLOCK } = require("./config");
const cryptoHash = require("./cryptoHash");

class Block {
  constructor({ data, hash, previousHash, timestamp }) {
    this.data = data;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
  }

  // used to create the genesis block
  static genesis() {
    return new this(GENESIS_BLOCK); // create a new block as the genesis block
  }

  // used to create a new block
  static mineBlock({ lastBlock, data }) {
    const previousHash = lastBlock.hash; // hash of the previous block
    const timestamp = Date.now(); // timestamp is a number
    const hash = cryptoHash(timestamp, previousHash, data); // create a hash of the data

    return new this({ data, timestamp, previousHash, hash }); // create a new block
  }
}

module.exports = Block;
