const Block = require("./block");
const cryptoHash = require("./cryptoHash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  // used to add a new block to the blockchain
  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    }); // create a new block

    this.chain.push(newBlock); // add the new block to the blockchain
  }

  static isValidChain(chain) {
    // check the first block is the genesis block
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { data, hash, previousHash, timestamp } = chain[i];
      const lastBlock = chain[i - 1];

      if (previousHash !== lastBlock.hash) return false;

      if (hash !== cryptoHash({ timestamp, previousHash, data })) return false;
    }

    return true;
  }
}

module.exports = Blockchain;
