// create-wallet.js を実行して devnet-wallet.json を作成する必要あり

const web3 = require('@solana/web3.js');
const fs = require('fs');

const main = async () => {
  const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync('./devnet-wallet.json')));
  const keypair = web3.Keypair.fromSecretKey(secretKey);

  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  const airdropSignature = await connection.requestAirdrop(
    keypair.publicKey,
    web3.LAMPORTS_PER_SOL * 2 // 2 SOL
  );

  await connection.confirmTransaction(airdropSignature, 'confirmed');
  console.log('✅ Airdrop complete to:', keypair.publicKey.toString());
};

main();
