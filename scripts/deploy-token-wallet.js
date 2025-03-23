const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const TokenWallet = await hre.ethers.getContractFactory("TokenWallet");
  const tokenWallet = await TokenWallet.deploy();
  await tokenWallet.waitForDeployment();

  console.log("TokenWallet deployed at:", tokenWallet.target);

  // BUSDの残高を確認
  const tokenAddress = "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47"; // BSC Testnet の BUSD
  const tokenBalance = await tokenWallet.getTokenBalance(tokenAddress);
  console.log(`TokenWallet's BUSD balance:`, hre.ethers.formatUnits(tokenBalance, 18), "BUSD");

  //const amount = hre.ethers.parseUnits("0.001", 18);
  //const sendTokenResult = await tokenWallet.sendToken(tokenAddress, "_address_", amount);

  // BNBを送信
  const sendTo = tokenWallet.target;
  const sendBnbAmount = "0.01";
  const tx = await deployer.sendTransaction({
    to: sendTo,
    value: ethers.parseEther(sendBnbAmount)
  });
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
