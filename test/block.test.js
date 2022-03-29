const { GENESIS_BLOCK } = require("../config");

const assert = require("assert");

const Block = require("../block");
const cryptoHash = require("../cryptoHash");

describe("Block", () => {
  const data = "bar";
  const hash = "bar";
  const previousHash = "foo";
  const timestamp = Date.now();
  const block = new Block({ data, hash, previousHash, timestamp });

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
        cryptoHash(minedBlock.timestamp, lastBlock.hash, data)
      );
    });
  });
});
