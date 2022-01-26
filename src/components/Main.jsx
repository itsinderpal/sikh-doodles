import React, { useState, useEffect } from "react";
import uuid from "react-uuid";

const Main = ({ mintNft, getSupply, totalSupply, hash, setHash, hasError }) => {
	const [images, setImages] = useState([]);
	const [ipfsAddress, setIpfsAddress] = useState(
		"https://ipfs.io/ipfs/QmVovQhoqFJRKdLZoJZnqVbbohKUE28RxJ5hwxEisfje6F"
	);
	const [isError, setIsError] = useState(false);

	// const getImages = async () => {
	// 	let imgs = [];
	// 	setImages([]);
	// 	for (let i = 51; i <= 60; i++) {
	// 		const response = await fetch(ipfsAddress + "/" + i + ".png");
	// 		imgs.push({
	// 			url: response.url,
	// 			tokenId: response.url.split("/")[5].replace(".png", ""),
	// 		});
	// 		setImages(imgs);
	// 	}
	// };

	useEffect(async () => {
		setHash("");
		getSupply();
	}, []);

	return (
		<div className="flex flex-col space-y-6 justify-center items-center p-10 w-full">
			<div className="bg-gray-50 border-2 border-black rounded-lg p-6 w-1/2 text-center space-y-6 drop-shadow-2xl">
				<h1 className="text-3xl font-semibold">Get your SikhDoodle</h1>
				<p>
					Get your own randomly genrated SikhDoodle from our unique 500 collection. This collection
					represents the Sikh community and it's people from all around the world.
				</p>
				<div className="border-2 border-black m-auto w-2/3"></div>
				<div className="space-y-3 font-bold text-xl">
					<p>{totalSupply ? `${500 - totalSupply}/500 LEFT` : "---/500"}</p>
					<p>COST: 1 MATIC</p>
				</div>
				<button
					className="p-2 bg-red-500 font-bold text-xl rounded-lg text-white drop-shadow-xl border-2 border-black hover:bg-red-400"
					onClick={() => mintNft()}>
					MINT YOUR NFT
				</button>
				{hash ? (
					<div>
						<p>Check your PolygonScan Tx here.</p>
						<p>Check your NFT on OpenSea here.</p>
					</div>
				) : (
					""
				)}
				{isError ? <p className="w-full bg-red-300 rounded-lg p-1">Error</p> : ""}
			</div>
			<div className="flex justify-center items-center flex-wrap w-full">
				{/* {images.length > 0
					? images.map((img) => {
							return (
								<div key={uuid()} className="text-center font-semibold p-3 space-y-2">
									<img
										src={img.url}
										alt="img"
										width="200"
										height="200"
										className="drop-shadow-2xl"
									/>
									<h3>{`Sikh Doodles #${img.tokenId}`}</h3>
									<button
										className="w-full p-2 font-semibold rounded-lg bg-green-200 hover:bg-green-300"
										onClick={() => mintNFT(img.tokenId)}>
										MINT 0.002 ETH
									</button>
								</div>
							);
					  })
					: "No Images"} */}
			</div>
		</div>
	);
};

export default Main;
