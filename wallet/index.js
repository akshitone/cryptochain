const Transaction = require("./transaction");
const { STARTING_BALANCE } = require("../config");
const { ec, cryptoHash } = require("../utils");

class Wallet {
  constructor() {
    this.keyPair = ec.genKeyPair(); // Generate a new key pair

    this.balance = STARTING_BALANCE; // Set the starting balance
    this.publicKey = this.keyPair.getPublic("hex"); // Get the public key of the wallet
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data)); // Sign the data with the private key of the wallet
  }

  createTransaction({ amount, recipient }) {
    // Check if the amount is greater than the balance of the wallet
    if (amount > this.balance) throw new Error("Amount exceeds balance");

    // Create a new transaction object with the wallet's public key and the recipient's address and amount
    return new Transaction({ senderWallet: this, recipient, amount });
  }
}

module.exports = Wallet;
