const web3 = require('@solana/web3.js');
const bs58 = require('bs58');
const fs = require('fs');

const keypair = web3.Keypair.generate();
const secretKey = Buffer.from(keypair.secretKey);
const base58 = bs58.encode(secretKey);

console.log('🔑 Public Key:', keypair.publicKey.toString());
console.log('🧾 Secret (Base58):', base58);

// 保存（任意）
fs.writeFileSync('./devnet-wallet.json', JSON.stringify(Array.from(secretKey)));
