const { GENESIS_BLOCK, MINE_RATE } = require("./config");
const cryptoHash = require("./cryptoHash");

class Block {
  constructor({ data, hash, previousHash, timestamp, nonce, difficulty }) {
    this.data = data;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_BLOCK);
  }

  static mineBlock({ lastBlock, data }) {
    const previousHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;
    let hash, timestamp;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      });
      hash = cryptoHash(timestamp, previousHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this({ data, timestamp, previousHash, hash, nonce, difficulty });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;

    if (difficulty < 1) return 1;

    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }
}

module.exports = Block;
