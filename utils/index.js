const cryptoHash = require("./cryptoHash");

const EC = require("elliptic").ec;

const ec = new EC("secp256k1"); // Create a new elliptic curve object with the secp256k1 algorithm

const verifySignature = ({ publicKey, data, signature }) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex"); // Create a key object from the public key

  return keyFromPublic.verify(data, signature); // Verify the signature with the data and the public key
};

module.exports = { ec, verifySignature };
