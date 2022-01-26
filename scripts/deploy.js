const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
	const SikhDoodles = await hre.ethers.getContractFactory("SikhDoodles");
	const sikhdoodles = await SikhDoodles.deploy();

	await sikhdoodles.deployed();

	console.log("SikhDoodles deployed to:", sikhdoodles.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
