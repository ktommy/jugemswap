const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const CreateNewToken = await hre.ethers.getContractFactory("CreateNewToken");
  const initialSupply = hre.ethers.parseUnits("1000000", 18);
  const token = await CreateNewToken.deploy(initialSupply);
  await token.waitForDeployment();

  console.log("MyToken deployed to:", token.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
