require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
	solidity: "0.8.4",
	paths: {
		artifacts: "./src/artifacts",
	},
	networks: {
		polygonMumbai: {
			url: process.env.ALCHEMY_POLYGON_MUMBAI_KEY,
			accounts: [process.env.PRIVATE_KEY],
		},
		polygonMainnet: {
			url: process.env.ALCHEMY_POLYGON_MAINNET_KEY,
			accounts: [process.env.PRIVATE_KEY],
		},
	},
};
