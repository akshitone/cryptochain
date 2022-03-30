const assert = require("assert");

const Blockchain = require("../blockchain");
const Block = require("../block");
const cryptoHash = require("../cryptoHash");

describe("Blockchain", () => {
  const blockchain = new Blockchain();
  it("contains a `chain` Array instance", () => {
    assert(blockchain.chain instanceof Array);
  });

  it("starts with the genesis block", () => {
    const blockchain = new Blockchain();
    assert.deepEqual(blockchain.chain[0], Block.genesis());
  });

  it("adds a new block to the chain", () => {
    const data = "foo";
    blockchain.addBlock({ data });

    assert.deepEqual(blockchain.chain[blockchain.chain.length - 1].data, data);
  });

  describe("isValidChain()", () => {
    describe("when the chain does not start with the genesis block", () => {
      blockchain.chain[0] = { data: "fake-genesis" };

      it("returns false", () => {
        assert(Blockchain.isValidChain(blockchain.chain) === false);
      });
    });

    describe("when the chain starts with the genesis block and has multiple blocks", () => {
      const data = "foo";
      blockchain.addBlock({ data });
      describe("and the lastHash reference has changed", () => {
        blockchain.chain[1].previousHash = "bar";

        it("returns false", () => {
          assert(Blockchain.isValidChain(blockchain.chain) === false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        blockchain.chain[1].data = "bar";

        it("returns false", () => {
          assert(Blockchain.isValidChain(blockchain.chain) === false);
        });
      });

      describe("and the chain does not contain any invalid blocks", () => {
        const blockchain = new Blockchain();
        it("returns true", () => {
          assert(Blockchain.isValidChain(blockchain.chain) === true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    const blockchain = new Blockchain();
    const secondBlockchain = new Blockchain();
    const originalChain = blockchain.chain;
    blockchain.addBlock({ data: "foo" });
    blockchain.addBlock({ data: "bar" });

    describe("when the new chain is not longer", () => {
      it("does not replace the chain", () => {
        secondBlockchain.chain[0] = { new: "chain" };
        blockchain.replaceChain(secondBlockchain.chain);

        assert.deepEqual(blockchain.chain, originalChain);
      });
    });

    describe("when the new chain is longer", () => {
      const secondBlockchain = new Blockchain();
      secondBlockchain.addBlock({ data: "baz" });
      secondBlockchain.addBlock({ data: "qux" });

      describe("and the new chain is invalid", () => {
        it("does not replace the chain", () => {
          secondBlockchain.chain[1].hash = "fake-hash";
          blockchain.replaceChain(secondBlockchain.chain);

          assert.deepEqual(blockchain.chain, originalChain);
        });
      });

      describe("and the new chain is valid", () => {
        const blockchain = new Blockchain();
        const secondBlockchain = new Blockchain();
        it("replaces the chain", () => {
          blockchain.replaceChain(secondBlockchain.chain);

          assert.deepEqual(blockchain.chain, secondBlockchain.chain);
        });
      });
    });
  });
});
