const Block = require("./block");
const cryptoHash = require("./cryptoHash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const lastBlock = this.chain[this.chain.length - 1];
    const newBlock = Block.mineBlock({ lastBlock, data });

    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, previousHash, hash, data } = chain[i];

      const actualpreviousHash = chain[i - 1].hash;

      if (previousHash !== actualpreviousHash) return false;

      if (hash !== cryptoHash(timestamp, previousHash, data)) return false;
    }

    return true;
  }
}

module.exports = Blockchain;
