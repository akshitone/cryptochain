const { v4: uuid } = require("uuid");

class Transaction {
  constructor({ senderWallet, recipient, amount }) {
    this.id = uuid();
    this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });
    this.input = this.createInput({
      senderWallet,
      signature: senderWallet.sign(this.outputMap), // Sign transaction with sender's private key
    });
  }

  createOutputMap({ senderWallet, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount; // Set recipient to amount
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount; // Set sender to balance - amount

    return outputMap;
  }

  createInput({ senderWallet, signature }) {
    return {
      timestamp: Date.now(), // Timestamp of transaction
      amount: senderWallet.balance, // Amount of transaction
      address: senderWallet.publicKey, // Address of transaction
      signature,
    };
  }
}

module.exports = Transaction;
