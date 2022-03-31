const { GENESIS_BLOCK, MINE_RATE } = require("../config");

const assert = require("assert");

const Block = require("../block");
const cryptoHash = require("../cryptoHash");

describe("Block", () => {
  const data = "bar";
  const hash = "bar";
  const previousHash = "foo";
  const timestamp = 2000;
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    data,
    hash,
    previousHash,
    timestamp,
    nonce,
    difficulty,
  });

  it("should be an instance of Block", () => {
    assert(block instanceof Block);
  });

  describe("Block.genesis()", () => {
    const genesisBlock = Block.genesis();

    it("should return a Block instance", () => {
      assert(genesisBlock instanceof Block);
    });

    it("should return the GENESIS_BLOCK", () => {
      assert.deepEqual(genesisBlock, GENESIS_BLOCK);
    });
  });

  describe("Block.mineBlock()", () => {
    const lastBlock = Block.genesis();
    const data = "foo";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("should return a Block instance", () => {
      assert(minedBlock instanceof Block);
    });

    it("should return a Block with correct data", () => {
      assert.deepEqual(minedBlock.data, data);
    });

    it("should create a SHA256 hash based on the data", () => {
      assert.deepEqual(
        minedBlock.hash,
        cryptoHash(
          minedBlock.timestamp,
          lastBlock.hash,
          data,
          minedBlock.nonce,
          minedBlock.difficulty
        )
      );
    });

    it("should sets a hash based on the difficulty", () => {
      assert.deepEqual(
        minedBlock.hash.substring(0, minedBlock.difficulty),
        "0".repeat(minedBlock.difficulty)
      );
    });

    it("should adjust the difficulty", () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];

      assert(possibleResults.includes(minedBlock.difficulty));
    });
  });

  describe("Block.adjustDifficulty()", () => {
    it("should raise the difficulty for a quickly mined block", () => {
      const expectedDifficulty = block.difficulty + 1;

      assert.equal(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        }),
        expectedDifficulty
      );
    });

    it("should lower the difficulty for a slowly mined block", () => {
      const expectedDifficulty = block.difficulty - 1;

      assert.equal(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        }),
        expectedDifficulty
      );
    });
  });
});
