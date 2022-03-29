const assert = require("assert");

const Blockchain = require("../blockchain");
const Block = require("../block");
const cryptoHash = require("../cryptoHash");

describe("Blockchain", () => {
  it("contains a `chain` Array instance", () => {
    const blockchain = new Blockchain();
    assert(blockchain.chain instanceof Array);
  });

  it("starts with the genesis block", () => {
    const blockchain = new Blockchain();
    assert.deepEqual(blockchain.chain[0], Block.genesis());
  });

  it("adds a new block to the chain", () => {
    const blockchain = new Blockchain();
    const data = "foo";
    blockchain.addBlock({ data });

    assert.deepEqual(blockchain.chain[blockchain.chain.length - 1].data, data);
  });

  describe("isValidChain()", () => {
    describe("when the chain does not start with the genesis block", () => {
      const blockchain = new Blockchain();
      blockchain.chain[0] = { data: "fake-genesis" };

      it("returns false", () => {
        assert(Blockchain.isValidChain(blockchain.chain) === false);
      });
    });

    describe("when the chain starts with the genesis block and has multiple blocks", () => {
      describe("and the lastHash reference has changed", () => {
        const blockchain = new Blockchain();
        const data = "foo";
        blockchain.addBlock({ data });
        blockchain.chain[1].previousHash = "bar";

        it("returns false", () => {
          assert(Blockchain.isValidChain(blockchain.chain) === false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        const blockchain = new Blockchain();
        const data = "foo";
        blockchain.addBlock({ data });
        blockchain.chain[1].data = "bar";

        it("returns false", () => {
          assert(Blockchain.isValidChain(blockchain.chain) === false);
        });
      });

      describe("and the chain does not contain any invalid blocks", () => {
        const blockchain = new Blockchain();
        const data = "foo";
        blockchain.addBlock({ data });

        it("returns true", () => {
          assert(Blockchain.isValidChain(blockchain.chain) === true);
        });
      });
    });
  });
});
