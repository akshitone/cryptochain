const { v4: uuid } = require("uuid");
const { verifySignature } = require("../utils");

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

  // Validate transaction with outputMap and input
  static validTransaction(transaction) {
    const { outputMap, input } = transaction;
    const { address, amount, signature } = input;

    // Sum of all output amounts in transaction outputMap
    const outputTotal = Object.values(outputMap).reduce(
      (total, outputAmount) => {
        return total + outputAmount;
      }
    );

    // Check if transaction amount is equal to sum of output amounts
    if (amount !== outputTotal) {
      console.error("Amount does not match outputTotal");
      return false;
    }

    if (!input) return false; // Check if input is defined in transaction
    if (!outputMap[address]) return false; // Check if outputMap has address as key in transaction

    // Check if signature is valid for outputMap
    if (
      !verifySignature({
        publicKey: address,
        data: outputMap,
        signature: signature,
      })
    ) {
      console.error("Invalid signature");
      return false;
    }
    return true;
  }
}

module.exports = Transaction;
