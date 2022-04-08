const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;

const GENESIS_BLOCK = {
  data: "Genesis Block",
  hash: "0",
  previousHash: "0",
  timestamp: Date.now(),
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
};

const STARTING_BALANCE = 1000;

module.exports = {
  GENESIS_BLOCK,
  INITIAL_DIFFICULTY,
  MINE_RATE,
  STARTING_BALANCE,
};
