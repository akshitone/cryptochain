const { GENESIS_BLOCK } = require("./config");
const cryptoHash = require("./cryptoHash");

class Block {
  constructor({ timestamp, previousHash, hash, data }) {
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.hash = hash;
    this.data = data;
  }

  static genesis() {
    return new this(GENESIS_BLOCK);
  }

  static mineBlock({ lastBlock, data }) {
    const timestamp = Date.now();
    const previousHash = lastBlock.hash;
    const hash = cryptoHash(timestamp, previousHash, data);

    return new this({ timestamp, previousHash, data, hash });
  }
}

module.exports = Block;
