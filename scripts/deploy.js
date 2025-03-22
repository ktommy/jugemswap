const hre = require("hardhat");

async function main() {
  const HelloWorld = await hre.ethers.getContractFactory("HelloWorld");
  const hello = await HelloWorld.deploy("Hello, world!");

  await hello.waitForDeployment();

  console.log(`HelloWorld deployed to: ${hello.target}`);

  // メッセージ取得
  const message = await hello.message();
  console.log("Initial message:", message);

  // メッセージ更新
  const tx = await hello.updateMessage("Hello, Kohei!");
  await tx.wait();

  const newMessage = await hello.message();
  console.log("Updated message:", newMessage);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
