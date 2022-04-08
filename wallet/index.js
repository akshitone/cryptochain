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
}

module.exports = Wallet;
