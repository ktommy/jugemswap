async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const EveCoin = await ethers.getContractFactory("EveCoin");
  const token = await EveCoin.deploy();

  await token.waitForDeployment();
  console.log("MyToken deployed to:", token.target);
}
  
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
