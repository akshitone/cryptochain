const { GENESIS_BLOCK, MINE_RATE } = require("../config");
const cryptoHash = require("../utils/cryptoHash");
const hexToBinary = require("hex-to-binary");

class Block {
  constructor({ data, hash, previousHash, timestamp, nonce, difficulty }) {
    this.data = data;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.nonce = nonce; // The number of times the hash has been generated
    this.difficulty = difficulty; // The number of zeros in the beginning of the hash
  }

  static genesis() {
    return new this(GENESIS_BLOCK); // Create the genesis block
  }

  static mineBlock({ lastBlock, data }) {
    const previousHash = lastBlock.hash; // Get the previous hash
    let { difficulty } = lastBlock; // Get the difficulty of the last block
    let nonce = 0;
    let hash, timestamp;

    do {
      nonce++; // Increment the nonce
      timestamp = Date.now(); // Get the current timestamp
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      }); // Adjust the difficulty of the block
      hash = cryptoHash(timestamp, previousHash, data, nonce, difficulty); // Generate the hash
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty) // Check if the hash starts with the required number of zeros
    );

    return new this({ data, timestamp, previousHash, hash, nonce, difficulty }); // Create the block
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock; // Get the difficulty of the last block

    if (difficulty < 1) return 1; // If the difficulty is less than 1, set it to 1

    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1; // If the block has been mined for more than the mine rate, decrease the difficulty

    return difficulty + 1; // Otherwise, increase the difficulty
  }
}

module.exports = Block;
