
const hre = require("hardhat");

async function main() {
  const DecentraDAO = await hre.ethers.getContractFactory("DecentraDAO");
  const decentraDAO = await DecentraDAO.deploy();

  await decentraDAO.deployed();

  console.log(
    `DecentraDAO deployed to ${decentraDAO.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
