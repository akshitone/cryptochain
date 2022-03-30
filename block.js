const { GENESIS_BLOCK } = require("./config");
const cryptoHash = require("./cryptoHash");

class Block {
  constructor({ data, hash, previousHash, timestamp }) {
    this.data = data;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
  }

  static genesis() {
    return new this(GENESIS_BLOCK);
  }

  static mineBlock({ lastBlock, data }) {
    const previousHash = lastBlock.hash;
    const timestamp = Date.now();
    const hash = cryptoHash(timestamp, previousHash, data);

    return new this({ data, timestamp, previousHash, hash });
  }
}

module.exports = Block;
