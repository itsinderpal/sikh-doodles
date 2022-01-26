import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SikhDoodles from "./artifacts/SikhDoodles.json";
import Main from "./components/Main";
import { formatUnits } from "ethers/lib/utils";

const App = () => {
	const { VITE_ALCHEMY_POLYGON_MAINNET_KEY } = import.meta.env;
	const contractAddress = "0x010360F217500aabc89448Ab6072085bc62053e4";

	const [address, setAddress] = useState("");
	const [balance, setBalance] = useState();
	const [totalSupply, setTotalSupply] = useState();
	const [hash, setHash] = useState("");
	const [hasError, setHasError] = useState(false);
	const [error, setError] = useState({
		message: "",
		chainId: "",
		persist: false,
	});

	const { ethereum } = window;

	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		// connected accounts
		if (ethereum) {
			const accounts = await ethereum.request({ method: "eth_accounts" }); // 0 for new users
			if (accounts.length !== 0) {
				const _address = accounts[0];
				setAddress(_address);
				getBalance();
			}
		}
	};

	const checkIfMetaMaskInstalled = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				setHasError(true);
				setError({ ...error, message: "MetaMask is not Installed. Please install and try again." });
				return false;
			} else {
				return true;
			}
		} catch (err) {
			console.log(err);
		}
	};

	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			const checkWallet = await checkIfMetaMaskInstalled();
			if (checkWallet) {
				const accounts = await ethereum.request({ method: "eth_requestAccounts" });
				console.log(accounts, accounts[0]);
				setAddress(accounts[0]);
				getBalance();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getBalance = async () => {
		try {
			const checkWallet = await checkIfMetaMaskInstalled();
			if (checkWallet) {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const signer = provider.getSigner();
				const _balance = await provider.getBalance(await signer.getAddress());
				const _balanceEth = ethers.utils.formatEther(_balance, 0);
				setBalance(_balanceEth);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const mintNft = async () => {
		try {
			const { ethereum } = window;

			if (address) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(contractAddress, SikhDoodles.abi, signer);

				const nftTxn = await contract.mint(address, 1, {
					value: "1000000000000000000",
				});

				await nftTxn.wait();

				console.log(`https://polygonscan.com/tx/${nftTxn.hash}`);
				setHash(nftTxn.hash);
			} else {
				connectWallet();
			}
		} catch (error) {
			if (error.code === 4001) {
				setHasError(true);
				setError({ ...error, message: "User denied the transaction." });
			} else if (
				error.data.code === -32000 ||
				error.message.includes("err: insufficient funds for gas")
			) {
				setHasError(true);
				setError({ ...error, message: "Insufficient funds for gas." });
			} else if (error.code === -32603) {
				setHasError(true);
				setError({ ...error, message: "There's an internal error. Please try again later." });
			}
		}
	};

	const getSupply = async () => {
		const alchemyProvider = new ethers.providers.JsonRpcProvider(VITE_ALCHEMY_POLYGON_MAINNET_KEY);
		const contract = new ethers.Contract(contractAddress, SikhDoodles.abi, alchemyProvider);
		const _totalSupply = await contract.totalSupply();
		const totalSupply = formatUnits(_totalSupply, 0);
		setTotalSupply(totalSupply);
	};

	const checkNetworkId = async () => {
		if (ethereum) {
			const _chainId = await ethereum.request({ method: "eth_chainId" });
			const chainIdInt = parseInt(_chainId, 16);
			console.log(chainIdInt);
			if (chainIdInt !== 137) {
				setHasError(true);
				setError({ ...error, message: "You need to be on the Polygon Mainnet.", persist: true });
			} else {
				setError({ ...error, persist: false });
			}
			console.log(error);
		}
	};

	const checkNetworkIdON = async () => {
		if (ethereum) {
			const _chainId = await ethereum.request({ method: "eth_chainId" });
			const chainIdInt = parseInt(_chainId, 16);
			console.log(chainIdInt);
			if (chainIdInt !== 137) {
				setHasError(true);
				setError({ ...error, message: "You need to be on the Polygon Mainnet.", persist: true });
			} else {
				setError({ ...error, persist: false });
			}
			console.log(error);
		}
		window.location.reload();
	};

	if (window.ethereum) {
		ethereum.on("accountsChanged", () => {
			window.location.reload();
		});
		ethereum.on("chainChanged", checkNetworkIdON);
	}

	const removeErrorMessage = () => {
		if (hasError) {
			if (!error.persist) {
				setTimeout(() => {
					setHasError(false);
				}, 3000);
			} else {
				console.log("it has persist");
			}
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
		getSupply();
		removeErrorMessage();
		checkNetworkId();
	}, []);

	// useEffect(() => removeErrorMessage(), [error, hasError]);

	return (
		<div className="font-mono bg-emerald-400 min-h-screen flex flex-col items-center">
			{hasError ? (
				<div className="p-1 w-full text-center font-bold bg-red-300">{error.message}</div>
			) : (
				""
			)}
			<div className="flex justify-between items-center text-white my-4 px-3 py-3 rounded-lg bg-gray-800 w-2/3 drop-shadow-2xl">
				<div className="text-xl font-semibold">
					<a href="/">Sikh Doodles</a>
				</div>
				<div className="space-x-6 flex items-center">
					<a
						onClick={() => window.open("https://opensea.io/collection/sikh-doodles", "_blank")}
						className="p-1 rounded-lg hover:bg-red-300 hover:text-black cursor-pointer">
						OpenSea
					</a>
					<a
						onClick={() => window.open("https://twitter.com/sikhdoodles", "_blank")}
						className="p-1 rounded-lg hover:bg-red-300 hover:text-black cursor-pointer">
						Twitter
					</a>
					<a
						onClick={() => window.open("https://discord.com/invite/mBUkphZp", "_blank")}
						className="p-1 rounded-lg hover:bg-red-300 hover:text-black cursor-pointer">
						Discord
					</a>
					<a className="p-1 rounded-lg hover:bg-red-300 hover:text-black cursor-pointer">About</a>
					{address ? (
						<div className="rounded-lg bg-red-400 flex items-center">
							<p className="px-1">{+(Math.round(balance + "e+3") + "e-3")}</p>
							<p className="bg-red-500 p-1 rounded-lg">
								{address.slice(0, 4)}....{address.slice(38)}
							</p>
						</div>
					) : (
						<button
							className="p-1 rounded-lg bg-red-500 hover:bg-red-400"
							onClick={() => {
								connectWallet();
							}}>
							Connect Wallet
						</button>
					)}
				</div>
			</div>
			<Main
				mintNft={mintNft}
				getSupply={getSupply}
				totalSupply={totalSupply}
				hash={hash}
				setHash={setHash}
				hasError={hasError}
			/>
		</div>
	);
};

export default App;
