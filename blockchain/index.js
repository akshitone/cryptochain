const Block = require("./block");
const { cryptoHash } = require("../utils");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
    return newBlock;
  }

  static isValidChain(chain) {
    // Check if the genesis block is valid (the first block in the chain)
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { data, hash, previousHash, timestamp, nonce, difficulty } =
        chain[i];

      const lastBlock = chain[i - 1]; // Get the last block in the chain

      if (Math.abs(lastBlock.difficulty - difficulty) > 1) return false; // Check if the difficulty is valid

      if (previousHash !== lastBlock.hash) return false; // Check if the previous hash is valid

      // Check if the hash is valid
      if (hash !== cryptoHash(timestamp, previousHash, data, nonce, difficulty))
        return false;
    }
    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("The incoming chain must be longer.");
      return;
    }

    if (!Blockchain.isValidChain(newChain)) {
      console.log("The incoming chain must be invalid.");
      return;
    }

    this.chain = newChain;
  }
}

module.exports = Blockchain;
