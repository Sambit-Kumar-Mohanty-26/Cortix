const { Keypair } = require("@solana/web3.js");
const bs58 = require("bs58");

const keypair = Keypair.generate();

console.log(`ADMIN_PUBLIC_KEY="${keypair.publicKey.toBase58()}"`);
console.log(`ADMIN_PRIVATE_KEY="[${keypair.secretKey.toString()}]"`);